from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import ProvenanceAgentResult
from app.tools.db import DatabaseQueries
import json
import logging

logger = logging.getLogger(__name__)

class ProvenanceAgent:
    """
    The Navigator: Enforces "Rolling Checkpoint" logic
    
    Core Logic:
    - Part must arrive at locations in sequence
    - Current location must match "next_allowed" in ledger
    - Previous location gets "locked out" after successful scan
    - Prevents parts from jumping stages or going backwards
    """
    
    def __init__(self):
        self.name = "Provenance Agent"
    
    def verify(
        self, 
        db: Session, 
        part_id: str, 
        current_location: str
    ) -> ProvenanceAgentResult:
        """
        Verify provenance and enforce rolling checkpoint
        
        Args:
            db: Database session
            part_id: Part identifier
            current_location: Where the part is being scanned
            
        Returns:
            Provenance verification result
        """
        logger.info(f"Provenance Agent checking: {part_id} at {current_location}")
        
        # Fetch part record
        part = DatabaseQueries.get_part_by_id(db, part_id)
        
        if not part:
            logger.error(f"Part {part_id} not found in ledger")
            return ProvenanceAgentResult(
                agent_name=self.name,
                passed=False,
                confidence=0,
                current_stage=current_location,
                expected_stage="UNKNOWN",
                sequence_valid=False,
                details={
                    "error": "Part not found in ledger",
                    "critical": True
                }
            )
        
        # Parse route plan
        try:
            route_plan = json.loads(part.route_plan) if isinstance(part.route_plan, str) else part.route_plan
        except json.JSONDecodeError:
            logger.error(f"Invalid route plan for {part_id}")
            return ProvenanceAgentResult(
                agent_name=self.name,
                passed=False,
                confidence=0,
                current_stage=current_location,
                expected_stage="ERROR",
                sequence_valid=False,
                details={
                    "error": "Route plan corrupted in database",
                    "critical": True
                }
            )
        
        details = {
            "part_id": part_id,
            "current_stage_ledger": part.current_stage,
            "next_allowed_ledger": part.next_allowed,
            "route_plan": route_plan,
            "part_status": part.status
        }
        
        # Check 1: Is part flagged or stolen?
        if part.status in ["FLAGGED", "STOLEN"]:
            logger.warning(f"Part {part_id} is {part.status}")
            return ProvenanceAgentResult(
                agent_name=self.name,
                passed=False,
                confidence=0,
                current_stage=current_location,
                expected_stage=part.next_allowed or "N/A",
                sequence_valid=False,
                details={
                    **details,
                    "error": f"Part status is {part.status}. Cannot proceed.",
                    "critical": True
                }
            )
        
        # Check 2: Rolling Checkpoint - Does current location match next_allowed?
        sequence_valid = (current_location == part.next_allowed)
        
        if not sequence_valid:
            logger.warning(
                f"Sequence violation for {part_id}: "
                f"Expected {part.next_allowed}, got {current_location}"
            )
            
            # Check if this is a backwards move (trying to go to previous location)
            try:
                current_index = route_plan.index(part.current_stage)
                attempted_index = route_plan.index(current_location) if current_location in route_plan else -1
                
                if attempted_index >= 0 and attempted_index <= current_index:
                    details["violation_type"] = "BACKWARDS_MOVEMENT"
                    details["explanation"] = "Part cannot return to previous checkpoint"
                elif attempted_index > current_index + 1:
                    details["violation_type"] = "SKIPPED_CHECKPOINT"
                    details["explanation"] = "Part cannot skip intermediate checkpoints"
                else:
                    details["violation_type"] = "UNAUTHORIZED_LOCATION"
                    details["explanation"] = f"Location {current_location} not in route plan"
                    
            except ValueError:
                details["violation_type"] = "UNKNOWN_LOCATION"
                details["explanation"] = f"Location {current_location} not recognized"
            
            return ProvenanceAgentResult(
                agent_name=self.name,
                passed=False,
                confidence=0,
                current_stage=current_location,
                expected_stage=part.next_allowed or "N/A",
                sequence_valid=False,
                next_allowed=part.next_allowed,
                details=details
            )
        
        # Check 3: Determine next checkpoint in sequence
        next_stage = self._get_next_stage(route_plan, current_location)
        
        details["next_checkpoint"] = next_stage
        details["progress"] = f"{route_plan.index(current_location) + 1}/{len(route_plan)}"
        
        # Update part location in database (Rolling Lock)
        try:
            DatabaseQueries.update_part_stage(
                db=db,
                part_id=part_id,
                new_stage=current_location,
                next_allowed=next_stage
            )
            details["ledger_updated"] = True
            logger.info(f"✓ Updated {part_id}: {current_location} → {next_stage}")
        except Exception as e:
            logger.error(f"Failed to update ledger: {str(e)}")
            details["ledger_updated"] = False
            details["update_error"] = str(e)
        
        # Success
        return ProvenanceAgentResult(
            agent_name=self.name,
            passed=True,
            confidence=100,
            current_stage=current_location,
            expected_stage=current_location,
            sequence_valid=True,
            next_allowed=next_stage,
            details=details
        )
    
    def _get_next_stage(self, route_plan: List[str], current_stage: str) -> str:
        """
        Determine the next allowed checkpoint
        
        Args:
            route_plan: List of checkpoints
            current_stage: Current checkpoint
            
        Returns:
            Next checkpoint or "DELIVERED" if at end
        """
        try:
            current_index = route_plan.index(current_stage)
            if current_index + 1 < len(route_plan):
                return route_plan[current_index + 1]
            else:
                return "DELIVERED"
        except ValueError:
            return "ERROR"
    
    def validate_route_plan(self, route_plan: List[str]) -> Dict[str, Any]:
        """
        Validate that a route plan is well-formed
        
        Args:
            route_plan: List of checkpoint locations
            
        Returns:
            Validation result
        """
        if not route_plan or len(route_plan) < 2:
            return {
                "valid": False,
                "reason": "Route must have at least 2 checkpoints"
            }
        
        # Check for duplicates
        if len(route_plan) != len(set(route_plan)):
            return {
                "valid": False,
                "reason": "Route contains duplicate checkpoints"
            }
        
        # Validate checkpoint format
        valid_prefixes = ["FACTORY_", "HUB_", "WAREHOUSE_", "STORE_"]
        for checkpoint in route_plan:
            if not any(checkpoint.startswith(prefix) for prefix in valid_prefixes):
                return {
                    "valid": False,
                    "reason": f"Invalid checkpoint format: {checkpoint}",
                    "expected_prefixes": valid_prefixes
                }
        
        return {
            "valid": True,
            "checkpoint_count": len(route_plan),
            "start": route_plan[0],
            "end": route_plan[-1]
        }
    
    def reroute_part(
        self, 
        db: Session, 
        part_id: str, 
        new_route: List[str],
        reason: str,
        modified_by: str
    ) -> Dict[str, Any]:
        """
        Admin function: Dynamically reroute a part
        
        Args:
            db: Database session
            part_id: Part to reroute
            new_route: New route plan
            reason: Reason for reroute
            modified_by: Admin user ID
            
        Returns:
            Reroute operation result
        """
        logger.info(f"Rerouting {part_id}: {new_route}")
        
        # Validate new route
        validation = self.validate_route_plan(new_route)
        if not validation["valid"]:
            return {
                "success": False,
                "error": validation["reason"]
            }
        
        # Get current part state
        part = DatabaseQueries.get_part_by_id(db, part_id)
        if not part:
            return {
                "success": False,
                "error": "Part not found"
            }
        
        try:
            # Update parts_ledger with new route
            db.execute(
                text("""
                    UPDATE parts_ledger
                    SET route_plan = :new_route,
                        next_allowed = :next_allowed,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE part_id = :part_id
                """),
                {
                    "part_id": part_id,
                    "new_route": json.dumps(new_route),
                    "next_allowed": new_route[0] if new_route else None
                }
            )
            
            # Log reroute in active_routes table
            db.execute(
                text("""
                    INSERT INTO active_routes 
                    (part_id, original_route, modified_route, reason, modified_by)
                    VALUES (:part_id, :original_route, :modified_route, :reason, :modified_by)
                """),
                {
                    "part_id": part_id,
                    "original_route": part.route_plan,
                    "modified_route": json.dumps(new_route),
                    "reason": reason,
                    "modified_by": modified_by
                }
            )
            
            db.commit()
            
            logger.info(f"✓ Reroute successful for {part_id}")
            return {
                "success": True,
                "part_id": part_id,
                "new_route": new_route,
                "next_checkpoint": new_route[0]
            }
            
        except Exception as e:
            db.rollback()
            logger.error(f"Reroute failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

# Singleton instance
provenance_agent = ProvenanceAgent()
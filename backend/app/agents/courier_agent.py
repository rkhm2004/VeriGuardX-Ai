from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models import CourierAgentResult
from app.tools.db import DatabaseQueries
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

class CourierAgent:
    """
    The Human Verifier: Validates personnel authorization
    
    Verifies:
    1. Courier exists and is active
    2. Courier is authorized for the region
    3. Courier is on shift at scan time
    4. Security clearance level is appropriate
    """
    
    def __init__(self):
        self.name = "Courier Agent"
    
    def verify(
        self,
        db: Session,
        courier_id: str,
        location: str,
        scan_time: datetime = None
    ) -> CourierAgentResult:
        """
        Verify courier authorization
        
        Args:
            db: Database session
            courier_id: Courier identifier
            location: Current location
            scan_time: Time of scan
            
        Returns:
            Courier verification result
        """
        logger.info(f"Courier Agent verifying: {courier_id} at {location}")
        
        scan_time = scan_time or datetime.now()
        
        # Fetch courier record
        courier = DatabaseQueries.get_courier(db, courier_id)
        
        if not courier:
            logger.warning(f"Courier {courier_id} not found or inactive")
            return CourierAgentResult(
                agent_name=self.name,
                passed=False,
                confidence=0,
                courier_name="UNKNOWN",
                shift_valid=False,
                region_authorized=False,
                clearance_level="NONE",
                details={
                    "error": "Courier not found in system or account inactive",
                    "courier_id": courier_id,
                    "critical": True
                }
            )
        
        details = {
            "courier_id": courier_id,
            "full_name": courier.full_name,
            "status": courier.status,
            "clearance": courier.security_clearance,
            "checks_performed": []
        }
        
        # Parse authorized regions
        try:
            authorized_regions = json.loads(courier.authorized_regions) if isinstance(
                courier.authorized_regions, str
            ) else courier.authorized_regions
        except json.JSONDecodeError:
            logger.error(f"Invalid authorized_regions for {courier_id}")
            authorized_regions = []
        
        details["authorized_regions"] = authorized_regions
        
        # Check 1: Region Authorization
        region_check = self._check_region_authorization(location, authorized_regions)
        details["region_check"] = region_check
        details["checks_performed"].append("region_authorization")
        
        region_authorized = region_check["authorized"]
        
        if not region_authorized:
            logger.warning(
                f"Courier {courier_id} not authorized for {location}. "
                f"Authorized regions: {authorized_regions}"
            )
        
        # Parse shift schedule
        try:
            shift_schedule = json.loads(courier.shift_schedule) if isinstance(
                courier.shift_schedule, str
            ) else courier.shift_schedule
        except json.JSONDecodeError:
            logger.error(f"Invalid shift_schedule for {courier_id}")
            shift_schedule = {}
        
        details["shift_schedule"] = shift_schedule
        
        # Check 2: Shift Validation
        shift_check = self._check_shift_time(scan_time, shift_schedule)
        details["shift_check"] = shift_check
        details["checks_performed"].append("shift_validation")
        
        shift_valid = shift_check["on_shift"]
        
        if not shift_valid:
            logger.warning(
                f"Courier {courier_id} scanned outside shift hours. "
                f"Current: {scan_time.strftime('%A %H:%M')}"
            )
        
        # Check 3: Security Clearance Level
        clearance_check = self._check_clearance_level(
            courier.security_clearance, location
        )
        details["clearance_check"] = clearance_check
        details["checks_performed"].append("security_clearance")
        
        clearance_sufficient = clearance_check["sufficient"]
        
        # Calculate overall result
        passed = region_authorized and shift_valid and clearance_sufficient
        
        # Calculate confidence
        confidence = 0
        if region_authorized:
            confidence += 40
        if shift_valid:
            confidence += 40
        if clearance_sufficient:
            confidence += 20
        
        if passed:
            logger.info(f"✓ Courier {courier_id} verified")
        else:
            logger.warning(f"✗ Courier {courier_id} verification failed")
            
            # Compile failure reasons
            failures = []
            if not region_authorized:
                failures.append("Unauthorized region")
            if not shift_valid:
                failures.append("Outside shift hours")
            if not clearance_sufficient:
                failures.append("Insufficient clearance")
            
            details["failure_reasons"] = failures
        
        return CourierAgentResult(
            agent_name=self.name,
            passed=passed,
            confidence=confidence,
            courier_name=courier.full_name,
            shift_valid=shift_valid,
            region_authorized=region_authorized,
            clearance_level=courier.security_clearance,
            details=details
        )
    
    def _check_region_authorization(
        self,
        location: str,
        authorized_regions: list
    ) -> Dict[str, Any]:
        """
        Check if courier is authorized for this region
        
        Args:
            location: Current location code
            authorized_regions: List of authorized location codes
            
        Returns:
            Authorization check result
        """
        # Direct match
        if location in authorized_regions:
            return {
                "authorized": True,
                "match_type": "exact"
            }
        
        # Check for wildcard matches (e.g., HUB_* matches HUB_BERLIN)
        location_prefix = location.split("_")[0] if "_" in location else location
        
        for region in authorized_regions:
            if "*" in region:
                region_prefix = region.split("*")[0]
                if location.startswith(region_prefix):
                    return {
                        "authorized": True,
                        "match_type": "wildcard",
                        "matched_pattern": region
                    }
        
        return {
            "authorized": False,
            "reason": f"Location {location} not in authorized regions",
            "closest_match": self._find_closest_region(location, authorized_regions)
        }
    
    def _find_closest_region(self, location: str, authorized_regions: list) -> str:
        """Find the most similar authorized region (for helpful error messages)"""
        if not authorized_regions:
            return "None"
        
        location_prefix = location.split("_")[0] if "_" in location else location
        
        for region in authorized_regions:
            if region.startswith(location_prefix):
                return region
        
        return authorized_regions[0]
    
    def _check_shift_time(
        self,
        scan_time: datetime,
        shift_schedule: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Check if scan occurred during courier's shift
        
        Args:
            scan_time: Time of scan
            shift_schedule: Dict mapping day names to shift times
            
        Returns:
            Shift validation result
        """
        day_name = scan_time.strftime("%A").lower()
        
        if day_name not in shift_schedule:
            # Try capitalized version
            day_name = scan_time.strftime("%A")
        
        shift = shift_schedule.get(day_name, "OFF")
        
        if shift == "OFF":
            return {
                "on_shift": False,
                "reason": "Courier is off duty today",
                "day": day_name
            }
        
        # Parse shift time (format: "08:00-16:00")
        try:
            start_str, end_str = shift.split("-")
            start_hour, start_min = map(int, start_str.split(":"))
            end_hour, end_min = map(int, end_str.split(":"))
            
            scan_hour = scan_time.hour
            scan_min = scan_time.minute
            
            # Convert to minutes for comparison
            scan_minutes = scan_hour * 60 + scan_min
            start_minutes = start_hour * 60 + start_min
            end_minutes = end_hour * 60 + end_min
            
            on_shift = start_minutes <= scan_minutes <= end_minutes
            
            return {
                "on_shift": on_shift,
                "shift_start": start_str,
                "shift_end": end_str,
                "scan_time": scan_time.strftime("%H:%M"),
                "day": day_name
            }
            
        except (ValueError, AttributeError) as e:
            logger.error(f"Invalid shift format: {shift}")
            return {
                "on_shift": False,
                "reason": "Invalid shift schedule format",
                "error": str(e)
            }
    
    def _check_clearance_level(
        self,
        courier_clearance: str,
        location: str
    ) -> Dict[str, Any]:
        """
        Verify courier's security clearance is sufficient for location
        
        Args:
            courier_clearance: Courier's clearance level
            location: Location being accessed
            
        Returns:
            Clearance check result
        """
        # Define clearance requirements by location type
        clearance_requirements = {
            "FACTORY_": "LEVEL_3",
            "HUB_": "LEVEL_2",
            "WAREHOUSE_": "LEVEL_1",
            "STORE_": "LEVEL_1"
        }
        
        # Clearance hierarchy
        clearance_hierarchy = {
            "LEVEL_1": 1,
            "LEVEL_2": 2,
            "LEVEL_3": 3,
            "LEVEL_4": 4
        }
        
        # Determine required clearance
        required_clearance = "LEVEL_1"
        for prefix, clearance in clearance_requirements.items():
            if location.startswith(prefix):
                required_clearance = clearance
                break
        
        courier_level = clearance_hierarchy.get(courier_clearance, 0)
        required_level = clearance_hierarchy.get(required_clearance, 1)
        
        sufficient = courier_level >= required_level
        
        return {
            "sufficient": sufficient,
            "courier_clearance": courier_clearance,
            "required_clearance": required_clearance,
            "location_type": location.split("_")[0] if "_" in location else location
        }

# Singleton instance
courier_agent = CourierAgent()
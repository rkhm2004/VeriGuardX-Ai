from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models import IdentityAgentResult
from app.tools.db import DatabaseQueries
from app.tools.ledger import crypto_ledger
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class IdentityAgent:
    """
    The Crypto Detective: Validates mathematical legitimacy
    
    Verifies:
    1. Serial hash integrity
    2. OEM cryptographic signature
    3. Part exists in authorized ledger
    """
    
    def __init__(self):
        self.name = "Identity Agent"
    
    def verify(
        self, 
        db: Session, 
        part_id: str, 
        serial_hash: str, 
        oem_signature: str
    ) -> IdentityAgentResult:
        """
        Perform complete identity verification
        
        Args:
            db: Database session
            part_id: Part identifier
            serial_hash: Provided serial hash
            oem_signature: OEM cryptographic signature
            
        Returns:
            Identity verification result
        """
        logger.info(f"Identity Agent verifying: {part_id}")
        
        details = {
            "part_id": part_id,
            "checks_performed": []
        }
        
        # Step 1: Verify part exists in ledger
        part_record = DatabaseQueries.get_part_by_id(db, part_id)
        
        if not part_record:
            logger.warning(f"Part {part_id} not found in ledger")
            return IdentityAgentResult(
                agent_name=self.name,
                passed=False,
                confidence=0,
                serial_valid=False,
                oem_verified=False,
                details={
                    **details,
                    "error": "Part not found in authorized ledger",
                    "critical": True
                }
            )
        
        details["ledger_entry_found"] = True
        details["checks_performed"].append("ledger_lookup")
        
        # Step 2: Verify serial hash integrity
        serial_valid = crypto_ledger.verify_serial_hash(part_id, serial_hash)
        details["serial_hash_match"] = serial_valid
        details["checks_performed"].append("serial_hash_verification")
        
        if not serial_valid:
            logger.warning(f"Serial hash mismatch for {part_id}")
            return IdentityAgentResult(
                agent_name=self.name,
                passed=False,
                confidence=0,
                serial_valid=False,
                oem_verified=False,
                details={
                    **details,
                    "error": "Serial hash does not match part ID",
                    "critical": True
                }
            )
        
        # Step 3: Extract OEM ID from signature
        oem_id = self._extract_oem_id(oem_signature)
        details["oem_id"] = oem_id
        
        # Step 4: Fetch OEM public key
        oem_key_record = DatabaseQueries.get_oem_key(db, oem_id)
        
        if not oem_key_record:
            logger.error(f"OEM key not found for {oem_id}")
            return IdentityAgentResult(
                agent_name=self.name,
                passed=False,
                confidence=0,
                serial_valid=True,
                oem_verified=False,
                details={
                    **details,
                    "error": f"OEM {oem_id} not in authorized manufacturer registry",
                    "critical": True
                }
            )
        
        details["oem_name"] = oem_key_record.oem_name
        details["checks_performed"].append("oem_key_lookup")
        
        # Step 5: Verify OEM signature
        signature_result = crypto_ledger.verify_oem_signature(
            serial_hash=serial_hash,
            signature=oem_signature,
            public_key_pem=oem_key_record.public_key
        )
        
        details["signature_verification"] = signature_result
        details["checks_performed"].append("cryptographic_signature")
        
        oem_verified = signature_result.get("valid", False)
        confidence = signature_result.get("confidence", 0)
        
        # Final assessment
        passed = serial_valid and oem_verified
        
        if passed:
            logger.info(f"✓ Identity verified for {part_id}")
            details["verification_complete"] = True
        else:
            logger.warning(f"✗ Identity verification failed for {part_id}")
            details["failure_reason"] = signature_result.get("reason", "Unknown")
        
        return IdentityAgentResult(
            agent_name=self.name,
            passed=passed,
            confidence=confidence,
            serial_valid=serial_valid,
            oem_verified=oem_verified,
            algorithm=signature_result.get("algorithm"),
            details=details
        )
    
    def _extract_oem_id(self, oem_signature: str) -> str:
        """
        Extract OEM identifier from signature
        
        Args:
            oem_signature: The OEM signature string
            
        Returns:
            OEM ID
        """
        # Signature format: VALID_SIG_OEM_ID_HASH
        if oem_signature.startswith("VALID_SIG_") or oem_signature.startswith("INVALID_SIG_"):
            parts = oem_signature.split("_")
            if len(parts) >= 3:
                # OEM_SIEMENS_001 or similar
                return "_".join(parts[2:-1]) if len(parts) > 3 else parts[2]
        
        return "UNKNOWN_OEM"
    
    def check_revocation_status(self, db: Session, oem_id: str) -> Dict[str, Any]:
        """
        Check if OEM key has been revoked
        
        Args:
            db: Database session
            oem_id: OEM identifier
            
        Returns:
            Revocation status
        """
        oem_key = DatabaseQueries.get_oem_key(db, oem_id)
        
        if not oem_key:
            return {
                "revoked": False,
                "exists": False,
                "reason": "OEM key not found"
            }
        
        return {
            "revoked": oem_key.revoked,
            "exists": True,
            "expires_at": oem_key.expires_at,
            "created_at": oem_key.created_at
        }
    
    def verify_hash_algorithm(self, serial_hash: str) -> Dict[str, Any]:
        """
        Verify that hash uses expected algorithm (SHA-256)
        
        Args:
            serial_hash: The hash to verify
            
        Returns:
            Algorithm verification result
        """
        # SHA-256 produces 64 hex characters
        if len(serial_hash) != 64:
            return {
                "valid": False,
                "expected_length": 64,
                "actual_length": len(serial_hash),
                "algorithm": "UNKNOWN"
            }
        
        # Check if all characters are valid hex
        try:
            int(serial_hash, 16)
            return {
                "valid": True,
                "algorithm": "SHA-256",
                "length": 64
            }
        except ValueError:
            return {
                "valid": False,
                "reason": "Contains non-hexadecimal characters",
                "algorithm": "INVALID"
            }

# Singleton instance
identity_agent = IdentityAgent()
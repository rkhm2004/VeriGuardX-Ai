from typing import Dict, Any, Tuple
from app.models import ScanRequest, ScanType
from app.tools.ledger import crypto_ledger
import logging

logger = logging.getLogger(__name__)

class ScanAgent:
    """
    The Gatekeeper: Identifies input method and routes workflow
    
    Decision Logic:
    - If QR code is valid → Path A (Digital Audit)
    - If QR code is missing/damaged → Path B (Visual Audit)
    """
    
    def __init__(self):
        self.name = "Scan Agent"
    
    def process(self, request: ScanRequest) -> Dict[str, Any]:
        """
        Process initial scan and determine routing path
        
        Args:
            request: Incoming scan request
            
        Returns:
            Dict containing scan analysis and routing decision
        """
        logger.info(f"Scan Agent processing: {request.scan_type}")
        
        if request.scan_type == ScanType.QR_SCAN and request.qr_data:
            return self._process_qr_scan(request)
        elif request.scan_type == ScanType.MANUAL_AUDIT:
            return self._process_manual_audit(request)
        else:
            return self._process_visual_inspection(request)
    
    def _process_qr_scan(self, request: ScanRequest) -> Dict[str, Any]:
        """
        Process QR code scan
        
        Returns:
            Path decision and extracted data
        """
        logger.info(f"Processing QR code: {request.qr_data[:20]}...")
        
        # Verify QR integrity
        qr_validation = crypto_ledger.verify_qr_integrity(request.qr_data)
        
        if qr_validation["valid"]:
            # QR is valid - go to Path A (Digital Audit)
            return {
                "route": "PATH_A_DIGITAL",
                "qr_valid": True,
                "part_id": qr_validation["part_id"],
                "serial_hash": qr_validation["serial_hash"],
                "oem_signature": qr_validation["oem_signature"],
                "confidence": qr_validation["confidence"],
                "message": "QR code validated successfully. Proceeding with digital audit.",
                "next_agents": ["identity", "provenance", "anomaly", "courier"]
            }
        else:
            # QR is invalid - go to Path B (Visual Audit)
            logger.warning(f"Invalid QR code: {qr_validation.get('reason')}")
            return {
                "route": "PATH_B_VISUAL",
                "qr_valid": False,
                "part_id": request.part_id,
                "reason": qr_validation.get("reason", "QR code validation failed"),
                "confidence": 0,
                "message": "QR code invalid. Initiating visual audit protocol.",
                "next_agents": ["visual", "courier"],
                "requires_user_input": True
            }
    
    def _process_manual_audit(self, request: ScanRequest) -> Dict[str, Any]:
        """
        Process manual audit request (no QR code available)
        
        Returns:
            Path B routing
        """
        logger.info("Manual audit requested - no QR code present")
        
        return {
            "route": "PATH_B_VISUAL",
            "qr_valid": False,
            "part_id": request.part_id,
            "reason": "Manual audit - QR code not present or damaged",
            "confidence": 0,
            "message": "Proceeding with visual audit. User input required.",
            "next_agents": ["visual", "courier"],
            "requires_user_input": True,
            "requires_image": not bool(request.user_description)
        }
    
    def _process_visual_inspection(self, request: ScanRequest) -> Dict[str, Any]:
        """
        Process visual inspection without QR
        
        Returns:
            Path B routing with visual context
        """
        logger.info("Visual inspection mode activated")
        
        has_image = bool(request.image_path)
        has_description = bool(request.user_description)
        
        if not has_image and not has_description:
            return {
                "route": "PATH_B_VISUAL",
                "qr_valid": False,
                "error": "Visual audit requires either image or description",
                "confidence": 0,
                "message": "Please provide either a photo or description of the part.",
                "requires_user_input": True
            }
        
        return {
            "route": "PATH_B_VISUAL",
            "qr_valid": False,
            "part_id": request.part_id,
            "has_image": has_image,
            "has_description": has_description,
            "confidence": 50,  # Lower confidence without QR
            "message": "Visual audit in progress. Analyzing provided information.",
            "next_agents": ["visual", "courier"]
        }
    
    def validate_scan_location(
        self, 
        location: str, 
        latitude: float = None, 
        longitude: float = None
    ) -> Dict[str, Any]:
        """
        Validate scan location data
        
        Args:
            location: Location code (e.g., HUB_BERLIN)
            latitude: GPS latitude
            longitude: GPS longitude
            
        Returns:
            Location validation result
        """
        # Basic validation
        if not location:
            return {
                "valid": False,
                "reason": "Location code is required"
            }
        
        # Check if location format is correct
        valid_prefixes = ["HUB_", "WAREHOUSE_", "FACTORY_", "STORE_"]
        if not any(location.startswith(prefix) for prefix in valid_prefixes):
            return {
                "valid": False,
                "reason": f"Invalid location format. Must start with: {valid_prefixes}"
            }
        
        # Validate GPS if provided
        if latitude is not None and longitude is not None:
            if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
                return {
                    "valid": False,
                    "reason": "GPS coordinates out of valid range"
                }
        
        return {
            "valid": True,
            "location": location,
            "has_gps": bool(latitude and longitude),
            "coordinates": {"lat": latitude, "lon": longitude} if latitude else None
        }
    
    def determine_visual_model(self, part_id: str) -> str:
        """
        Attempt to determine visual model ID from part ID
        
        Args:
            part_id: The part identifier
            
        Returns:
            Likely visual model ID
        """
        # Extract model hint from part ID
        # e.g., PART_SERVO_12345 -> MDL_SERVO_001
        if "_" in part_id:
            parts = part_id.split("_")
            if len(parts) >= 2:
                category = parts[1]
                return f"MDL_{category}_001"
        
        return "MDL_UNKNOWN_001"

# Singleton instance
scan_agent = ScanAgent()
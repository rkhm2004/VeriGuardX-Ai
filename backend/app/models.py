from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# --- ENUMS ---

class ScanType(str, Enum):
    QR_SCAN = "QR_SCAN"
    MANUAL_AUDIT = "MANUAL_AUDIT"
    VISUAL_INSPECTION = "VISUAL_INSPECTION"

class PartStatus(str, Enum):
    ACTIVE = "ACTIVE"
    FLAGGED = "FLAGGED"
    STOLEN = "STOLEN"
    DELIVERED = "DELIVERED"
    QUARANTINE = "QUARANTINE"

class Verdict(str, Enum):
    AUTHENTIC = "AUTHENTIC"
    COUNTERFEIT = "COUNTERFEIT"
    SUSPICIOUS = "SUSPICIOUS"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    # Added these two to match main.py logic:
    MANUAL_REVIEW = "MANUAL_REVIEW" 
    APPROVED = "APPROVED"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

# --- REQUEST MODELS ---

class ScanRequest(BaseModel):
    """Initial scan input from frontend"""
    part_id: Optional[str] = None
    qr_data: Optional[str] = None
    location: str = Field(..., description="Current hub/warehouse location")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    courier_id: str = Field(..., description="ID of courier performing scan")
    scan_type: ScanType = ScanType.QR_SCAN
    image_path: Optional[str] = None
    user_description: Optional[str] = None

class VisualAuditRequest(BaseModel):
    """Request for visual-only audit when QR fails"""
    part_id: Optional[str] = None
    visual_model_id: str
    location: str
    courier_id: str
    user_description: Optional[str] = None
    image_path: Optional[str] = None

class RerouteRequest(BaseModel):
    """Admin request to change part destination"""
    part_id: str
    new_route: List[str]
    reason: str
    modified_by: str

# --- RESPONSE MODELS ---

class AgentResult(BaseModel):
    """Generic agent response structure"""
    agent_name: str
    passed: bool
    confidence: float = Field(..., ge=0, le=100)
    details: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.now)

class IdentityAgentResult(AgentResult):
    """Identity verification result"""
    serial_valid: bool
    oem_verified: bool
    algorithm: Optional[str] = None

class ProvenanceAgentResult(AgentResult):
    """Provenance check result"""
    current_stage: str
    expected_stage: str
    sequence_valid: bool
    next_allowed: Optional[str] = None

class AnomalyAgentResult(AgentResult):
    """Anomaly detection result"""
    anomalies_detected: List[str]
    velocity_check: bool
    clone_check: bool
    statistical_score: float

class CourierAgentResult(AgentResult):
    """Courier verification result"""
    courier_name: str
    shift_valid: bool
    region_authorized: bool
    clearance_level: str

class VisualAgentResult(AgentResult):
    """Visual audit result"""
    match_score: float
    discrepancies: List[str]
    verdict: str

class RiskScore(BaseModel):
    """Aggregated risk assessment"""
    overall_score: float = Field(..., ge=0, le=100)
    risk_level: RiskLevel
    contributing_factors: Dict[str, Any]
    weighted_scores: Dict[str, float]
    action_required: Optional[str] = None

class FinalVerdict(BaseModel):
    """Council supervisor's final decision"""
    verdict: Verdict
    confidence: float = Field(..., ge=0, le=100)
    risk_level: RiskLevel
    reasoning: str
    critical_findings: List[str]
    recommended_action: str
    agent_scores: Dict[str, AgentResult]

class ProductInfo(BaseModel):
    """Product information for enhanced scan results"""
    name: str
    image_url: str
    description: str

class AuditResponse(BaseModel):
    """Complete audit result returned to frontend"""
    scan_id: int
    part_id: str
    verdict: FinalVerdict
    risk_score: Any # Using Any to be flexible with simplified Risk Logic
    agent_results: Dict[str, AgentResult]
    product_info: Optional[ProductInfo] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    processing_time_ms: float

# --- DATABASE MODELS (Reference) ---

class PartLedger(BaseModel):
    """Part ledger database model"""
    part_id: str
    serial_hash: str
    oem_signature: str
    current_stage: str
    next_allowed: Optional[str]
    route_plan: List[str]
    visual_model_id: str
    status: PartStatus
    created_at: datetime
    updated_at: datetime

class VisualGroundTruth(BaseModel):
    """Visual reference database model"""
    model_id: str
    part_name: str
    manufacturer: str
    description: str
    key_features: Dict[str, Any]
    reference_image_url: Optional[str]
    color: str
    material: str
    dimensions: Dict[str, float]
    weight_grams: float

class Courier(BaseModel):
    """Courier database model"""
    courier_id: str
    full_name: str
    authorized_regions: List[str]
    shift_schedule: Dict[str, str]
    security_clearance: str
    status: str

class ScanHistoryEntry(BaseModel):
    """Scan history database model"""
    scan_id: int
    part_id: str
    location: str
    latitude: Optional[float]
    longitude: Optional[float]
    scan_type: str
    timestamp: datetime
    courier_id: str
    qr_valid: bool
    image_path: Optional[str]

class AnomalyLog(BaseModel):
    """Anomaly log database model"""
    anomaly_id: int
    part_id: str
    anomaly_type: str
    severity: Severity
    details: Dict[str, Any]
    detected_at: datetime
    resolved: bool

# --- UTILITY MODELS ---

class HealthCheck(BaseModel):
    """API health check response"""
    status: str
    timestamp: datetime = Field(default_factory=datetime.now)
    version: str
    services: Dict[str, bool]

class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
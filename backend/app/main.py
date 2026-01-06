import asyncio
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Dict, Any
import time
import logging
from datetime import datetime

from app.models import (
    ScanRequest, VisualAuditRequest, RerouteRequest,
    AuditResponse, HealthCheck, ErrorResponse,
    FinalVerdict, Verdict, AgentResult
)
from app.tools.db import get_db, DatabaseQueries
from app.tools.vision import vision_service
from app.agents.scan_agent import scan_agent
from app.agents.identity_agent import identity_agent
from app.agents.provenance_agent import provenance_agent
from app.agents.anomaly_agent import anomaly_agent
from app.agents.courier_agent import courier_agent
from app.agents.marketplace_agent import marketplace_agent
from app.agents.risk_agent import risk_agent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="AI Trust & Safety Command Center",
    description="Multi-Agent Counterfeit Detection System",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_model=HealthCheck)
async def root():
    """Health check endpoint"""
    return HealthCheck(
        status="operational",
        version="1.0.0",
        services={
            "database": True,
            "ollama": True,
            "agents": True
        }
    )

@app.post("/api/scan", response_model=AuditResponse)
async def process_scan(
    request: ScanRequest,
    db: Session = Depends(get_db)
):
    """
    Main endpoint: Process part scan and perform audit
    
    Workflow:
    1. Scan Agent: Determine path (A: Digital, B: Visual)
    2. Execute appropriate agent sequence
    3. Risk Agent: Aggregate results
    4. Council Agent: Synthesize final verdict
    """
    start_time = time.time()
    logger.info(f"Processing scan request for part: {request.part_id}")
    
    try:
        # Step 1: Scan Agent - Route determination
        scan_result = scan_agent.process(request)
        
        if scan_result["route"] == "PATH_A_DIGITAL":
            # Digital Audit Path
            audit_result = await _execute_digital_audit(
                db, request, scan_result
            )
        else:
            # Visual Audit Path
            audit_result = await _execute_visual_audit(
                db, request, scan_result
            )
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        audit_result.processing_time_ms = round(processing_time, 2)
        
        logger.info(f"Audit complete: {audit_result.verdict.verdict} (Risk: {audit_result.risk_score.risk_level})")
        
        return audit_result
        
    except Exception as e:
        logger.error(f"Audit failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def _execute_digital_audit(
    db: Session,
    request: ScanRequest,
    scan_result: Dict[str, Any]
) -> AuditResponse:
    """
    Execute Path A: Digital Audit

    Agents: Provenance → (Identity + Anomaly + Marketplace) → Courier → Risk → Council
    """
    logger.info("Executing digital audit (Path A)")
    
    agent_results = {}
    
    # Log scan to database
    scan_id = DatabaseQueries.log_scan(
        db=db,
        scan_data={
            "part_id": scan_result["part_id"],
            "location": request.location,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "scan_type": request.scan_type,
            "courier_id": request.courier_id,
            "qr_valid": scan_result["qr_valid"],
            "image_path": request.image_path
        }
    )
    
    # Agent 1: Provenance Check (Rolling Checkpoint - as per blueprint)
    provenance_result = provenance_agent.verify(
        db=db,
        part_id=scan_result["part_id"],
        current_location=request.location
    )
    agent_results["Provenance Agent"] = provenance_result

    # Get part details for marketplace search
    part_info = DatabaseQueries.get_part_by_id(db, scan_result["part_id"])

    # Parallel execution: Identity + Anomaly + Marketplace (as per blueprint)
    async def run_parallel_checks():
        # Identity Agent
        identity_task = identity_agent.verify(
            db=db,
            part_id=scan_result["part_id"],
            serial_hash=scan_result["serial_hash"],
            oem_signature=scan_result["oem_signature"]
        )

        # Anomaly Agent
        anomaly_task = anomaly_agent.analyze(
            db=db,
            part_id=scan_result["part_id"],
            current_location=request.location,
            latitude=request.latitude,
            longitude=request.longitude,
            scan_time=datetime.now()
        )

        # Marketplace Agent
        if part_info:
            marketplace_task = marketplace_agent.verify_product(
                part_name=part_info.part_name or "Unknown Part",
                manufacturer=part_info.manufacturer or "Unknown Manufacturer",
                serial_number=scan_result.get("serial_hash")
            )
        else:
            marketplace_task = {
                "agent_name": "Marketplace Agent",
                "passed": False,
                "confidence": 0,
                "details": {},
                "findings": ["Part information not found in database"]
            }

        return await asyncio.gather(identity_task, anomaly_task, marketplace_task)

    identity_result, anomaly_result, marketplace_result = await run_parallel_checks()
    agent_results["Identity Agent"] = identity_result
    agent_results["Anomaly Agent"] = anomaly_result
    agent_results["Marketplace Agent"] = AgentResult(**marketplace_result)

    # Agent 5: Courier Verification
    courier_result = courier_agent.verify(
        db=db,
        courier_id=request.courier_id,
        location=request.location,
        scan_time=datetime.now()
    )
    agent_results["Courier Agent"] = courier_result
    
    # Agent 5: Risk Assessment
    risk_score = risk_agent.calculate_risk(agent_results)
    
    # Agent 6: Council Supervisor - Synthesize verdict
    council_result = await vision_service.synthesize_verdict(
        agent_results={k: v.model_dump() for k, v in agent_results.items()},
        context={
            "part_id": scan_result["part_id"],
            "location": request.location,
            "courier_id": request.courier_id,
            "scan_type": "DIGITAL"
        }
    )
    
    if council_result["success"]:
        import json
        verdict_data = json.loads(council_result["verdict"])
        final_verdict = FinalVerdict(
            verdict=Verdict(verdict_data.get("verdict", "NEEDS_REVIEW")),
            confidence=verdict_data.get("confidence", 50),
            risk_level=risk_score.risk_level,
            reasoning=verdict_data.get("reasoning", ""),
            critical_findings=verdict_data.get("critical_findings", []),
            recommended_action=verdict_data.get("recommended_action", ""),
            agent_scores=agent_results
        )
    else:
        # Fallback verdict if LLM fails
        final_verdict = FinalVerdict(
            verdict=Verdict.NEEDS_REVIEW,
            confidence=50,
            risk_level=risk_score.risk_level,
            reasoning="Council agent unavailable. Manual review required.",
            critical_findings=["LLM synthesis failed"],
            recommended_action="Escalate to human supervisor",
            agent_scores=agent_results
        )
    
    # Save verdict to database
    DatabaseQueries.save_verdict(
        db=db,
        verdict_data={
            "part_id": scan_result["part_id"],
            "scan_id": scan_id,
            "verdict": final_verdict.verdict,
            "confidence_score": final_verdict.confidence,
            "reasoning": final_verdict.reasoning,
            "agent_scores": str(agent_results),
            "risk_level": risk_score.risk_level
        }
    )
    
    return AuditResponse(
        scan_id=scan_id,
        part_id=scan_result["part_id"],
        verdict=final_verdict,
        risk_score=risk_score,
        agent_results=agent_results,
        processing_time_ms=0  # Will be set by caller
    )

async def _execute_visual_audit(
    db: Session,
    request: ScanRequest,
    scan_result: Dict[str, Any]
) -> AuditResponse:
    """
    Execute Path B: Visual Audit
    
    Agents: Visual → Courier → Risk → Council
    """
    logger.info("Executing visual audit (Path B)")
    
    agent_results = {}
    
    # Determine visual model ID
    visual_model_id = scan_agent.determine_visual_model(
        request.part_id or "UNKNOWN"
    )
    
    # Fetch ground truth
    ground_truth = DatabaseQueries.get_visual_ground_truth(db, visual_model_id)
    
    if not ground_truth:
        raise HTTPException(
            status_code=404,
            detail=f"Visual ground truth not found for model {visual_model_id}"
        )
    
    # Log scan
    scan_id = DatabaseQueries.log_scan(
        db=db,
        scan_data={
            "part_id": request.part_id or "VISUAL_AUDIT",
            "location": request.location,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "scan_type": request.scan_type,
            "courier_id": request.courier_id,
            "qr_valid": False,
            "image_path": request.image_path
        }
    )
    
    # Visual Agent: Compare description or image
    if request.image_path:
        # Image-based analysis
        visual_result_raw = await vision_service.analyze_image(
            image_path=request.image_path,
            prompt="Analyze this part and compare it to the reference description.",
            reference_description=ground_truth.description
        )
    else:
        # Description-based analysis
        visual_result_raw = await vision_service.compare_visual_description(
            user_description=request.user_description or "",
            ground_truth={
                "part_name": ground_truth.part_name,
                "manufacturer": ground_truth.manufacturer,
                "description": ground_truth.description,
                "color": ground_truth.color,
                "material": ground_truth.material,
                "key_features": ground_truth.key_features
            }
        )
    
    # Parse visual result
    import json
    if visual_result_raw["success"]:
        try:
            visual_data = json.loads(visual_result_raw.get("comparison") or visual_result_raw.get("analysis", "{}"))
            visual_passed = visual_data.get("verdict", "SUSPICIOUS") == "AUTHENTIC"
            visual_confidence = visual_data.get("confidence", 50)
        except:
            visual_passed = False
            visual_confidence = 0
            visual_data = {"error": "Failed to parse visual analysis"}
    else:
        visual_passed = False
        visual_confidence = 0
        visual_data = {"error": visual_result_raw.get("error", "Visual analysis failed")}
    
    visual_agent_result = AgentResult(
        agent_name="Visual Agent",
        passed=visual_passed,
        confidence=visual_confidence,
        details=visual_data
    )
    agent_results["Visual Agent"] = visual_agent_result
    
    # Courier Agent
    courier_result = courier_agent.verify(
        db=db,
        courier_id=request.courier_id,
        location=request.location
    )
    agent_results["Courier Agent"] = courier_result
    
    # Risk Assessment (visual-only mode)
    risk_score = risk_agent.calculate_visual_only_risk(
        visual_agent_result, courier_result
    )
    
    # Council verdict
    council_result = await vision_service.synthesize_verdict(
        agent_results={k: v.model_dump() for k, v in agent_results.items()},
        context={
            "part_id": request.part_id or "VISUAL_AUDIT",
            "location": request.location,
            "courier_id": request.courier_id,
            "scan_type": "VISUAL"
        }
    )
    
    if council_result["success"]:
        verdict_data = json.loads(council_result["verdict"])
        final_verdict = FinalVerdict(
            verdict=Verdict(verdict_data.get("verdict", "NEEDS_REVIEW")),
            confidence=verdict_data.get("confidence", 50),
            risk_level=risk_score.risk_level,
            reasoning=verdict_data.get("reasoning", ""),
            critical_findings=verdict_data.get("critical_findings", []),
            recommended_action=verdict_data.get("recommended_action", ""),
            agent_scores=agent_results
        )
    else:
        final_verdict = FinalVerdict(
            verdict=Verdict.SUSPICIOUS,
            confidence=visual_confidence,
            risk_level=risk_score.risk_level,
            reasoning="Visual audit without QR verification. Manual review recommended.",
            critical_findings=["No digital verification available"],
            recommended_action="Require QR scan or escalate to supervisor",
            agent_scores=agent_results
        )
    
    # Save verdict
    DatabaseQueries.save_verdict(
        db=db,
        verdict_data={
            "part_id": request.part_id or "VISUAL_AUDIT",
            "scan_id": scan_id,
            "verdict": final_verdict.verdict,
            "confidence_score": final_verdict.confidence,
            "reasoning": final_verdict.reasoning,
            "agent_scores": str(agent_results),
            "risk_level": risk_score.risk_level
        }
    )
    
    return AuditResponse(
        scan_id=scan_id,
        part_id=request.part_id or "VISUAL_AUDIT",
        verdict=final_verdict,
        risk_score=risk_score,
        agent_results=agent_results,
        processing_time_ms=0
    )

@app.post("/api/reroute")
async def reroute_part(
    request: RerouteRequest,
    db: Session = Depends(get_db)
):
    """Admin endpoint: Dynamically reroute a part"""
    logger.info(f"Rerouting part {request.part_id}")
    
    result = provenance_agent.reroute_part(
        db=db,
        part_id=request.part_id,
        new_route=request.new_route,
        reason=request.reason,
        modified_by=request.modified_by
    )
    
    if result["success"]:
        return result
    else:
        raise HTTPException(status_code=400, detail=result.get("error"))

@app.get("/api/part/{part_id}")
async def get_part_status(part_id: str, db: Session = Depends(get_db)):
    """Get current status of a part"""
    part = DatabaseQueries.get_part_by_id(db, part_id)
    
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    
    return {
        "part_id": part.part_id,
        "current_stage": part.current_stage,
        "next_allowed": part.next_allowed,
        "status": part.status,
        "route_plan": part.route_plan
    }

@app.get("/api/courier/{courier_id}")
async def get_courier_info(courier_id: str, db: Session = Depends(get_db)):
    """Get courier information"""
    courier = DatabaseQueries.get_courier(db, courier_id)
    
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")
    
    return {
        "courier_id": courier.courier_id,
        "full_name": courier.full_name,
        "security_clearance": courier.security_clearance,
        "status": courier.status
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

from sqlalchemy.orm import Session
from app.models import AgentResult
from app.tools.db import DatabaseQueries

class ProvenanceAgent:
    def verify(self, db: Session, part_id: str, current_location: str) -> AgentResult:
        part = DatabaseQueries.get_part_by_id(db, part_id)

        if not part:
            return AgentResult(agent_name="Provenance Agent", passed=False, confidence=0.0, details={"error": "Part not found"})

        # Simple Logic: Does location match DB?
        expected = part.current_location
        match = (current_location == expected)

        return AgentResult(
            agent_name="Provenance Agent",
            passed=match,
            confidence=1.0 if match else 0.0,
            details={"expected": expected, "actual": current_location}
        )

provenance_agent = ProvenanceAgent()
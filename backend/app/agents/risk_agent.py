from typing import Dict, Any
from app.models import RiskScore, RiskLevel, AgentResult
import os
import logging

logger = logging.getLogger(__name__)

# Weights from environment (must sum to 1.0)
WEIGHT_IDENTITY = float(os.getenv("WEIGHT_IDENTITY", "0.25"))
WEIGHT_PROVENANCE = float(os.getenv("WEIGHT_PROVENANCE", "0.30"))
WEIGHT_ANOMALY = float(os.getenv("WEIGHT_ANOMALY", "0.25"))
WEIGHT_COURIER = float(os.getenv("WEIGHT_COURIER", "0.20"))

class RiskAgent:
    """
    Dynamic Risk Scorecard: Aggregates results from all agents
    
    Scoring Logic:
    - Each agent contributes a weighted score
    - Critical failures override other considerations
    - Overall risk level determined by thresholds
    """
    
    def __init__(self):
        self.name = "Risk Agent"
        self.weights = {
            "identity": WEIGHT_IDENTITY,
            "provenance": WEIGHT_PROVENANCE,
            "anomaly": WEIGHT_ANOMALY,
            "courier": WEIGHT_COURIER
        }
    
    def calculate_risk(
        self,
        agent_results: Dict[str, AgentResult]
    ) -> RiskScore:
        """
        Calculate overall risk score from agent results
        
        Args:
            agent_results: Dictionary of agent names to their results
            
        Returns:
            Aggregated risk assessment
        """
        logger.info("Risk Agent calculating overall risk score")
        
        weighted_scores = {}
        contributing_factors = {}
        critical_failures = []
        
        # Process each agent's result
        for agent_name, result in agent_results.items():
            weight_key = agent_name.lower().replace(" agent", "").strip()
            weight = self.weights.get(weight_key, 0)
            
            # Calculate weighted contribution
            # If agent passed: use confidence score
            # If agent failed: score is 0 (maximum risk)
            agent_score = result.confidence if result.passed else 0
            weighted_score = agent_score * weight
            
            weighted_scores[agent_name] = weighted_score
            contributing_factors[agent_name] = {
                "passed": result.passed,
                "confidence": result.confidence,
                "weight": weight,
                "weighted_contribution": weighted_score
            }
            
            # Check for critical failures
            if not result.passed and result.details.get("critical", False):
                critical_failures.append({
                    "agent": agent_name,
                    "issue": result.details.get("error", "Critical failure")
                })
        
        # Calculate overall score (0-100, where 0 = maximum risk, 100 = no risk)
        overall_score = sum(weighted_scores.values())
        
        # Apply critical failure penalty
        if critical_failures:
            # Critical failures drastically reduce score
            penalty = len(critical_failures) * 30
            overall_score = max(0, overall_score - penalty)
            contributing_factors["critical_penalty"] = {
                "failures": critical_failures,
                "penalty_applied": penalty
            }
        
        # Determine risk level
        risk_level = self._determine_risk_level(overall_score, critical_failures)

        # Smart retry: if borderline score, suggest rescan
        action_required = None
        if 35 <= overall_score <= 45:
            action_required = "RESCAN_SUGGESTED"

        logger.info(
            f"Risk calculation complete: Score={overall_score:.2f}, "
            f"Level={risk_level}, Action={action_required}"
        )

        return RiskScore(
            overall_score=round(overall_score, 2),
            risk_level=risk_level,
            contributing_factors=contributing_factors,
            weighted_scores={k: round(v, 2) for k, v in weighted_scores.items()},
            action_required=action_required
        )
    
    def _determine_risk_level(
        self,
        score: float,
        critical_failures: list
    ) -> RiskLevel:
        """
        Determine risk level based on score and critical failures
        
        Risk Thresholds:
        - CRITICAL: Any critical failure OR score < 25
        - HIGH: Score 25-50
        - MEDIUM: Score 50-75
        - LOW: Score > 75
        """
        if critical_failures or score < 25:
            return RiskLevel.CRITICAL
        elif score < 50:
            return RiskLevel.HIGH
        elif score < 75:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW
    
    def calculate_visual_only_risk(
        self,
        visual_result: AgentResult,
        courier_result: AgentResult
    ) -> RiskScore:
        """
        Calculate risk for visual-only audit (Path B)
        
        Args:
            visual_result: Result from visual agent
            courier_result: Result from courier agent
            
        Returns:
            Risk assessment for visual audit
        """
        logger.info("Calculating risk for visual-only audit")
        
        # For visual audits, we weight heavily on visual match and courier
        visual_weight = 0.70
        courier_weight = 0.30
        
        visual_score = visual_result.confidence if visual_result.passed else 0
        courier_score = courier_result.confidence if courier_result.passed else 0
        
        overall_score = (visual_score * visual_weight) + (courier_score * courier_weight)
        
        # Visual audits have inherently higher uncertainty
        # Apply uncertainty penalty
        uncertainty_penalty = 10  # 10% reduction due to lack of digital verification
        overall_score = max(0, overall_score - uncertainty_penalty)
        
        contributing_factors = {
            "visual_agent": {
                "passed": visual_result.passed,
                "confidence": visual_result.confidence,
                "weight": visual_weight,
                "weighted_contribution": visual_score * visual_weight
            },
            "courier_agent": {
                "passed": courier_result.passed,
                "confidence": courier_result.confidence,
                "weight": courier_weight,
                "weighted_contribution": courier_score * courier_weight
            },
            "uncertainty_penalty": {
                "reason": "Visual audit without digital verification",
                "penalty": uncertainty_penalty
            }
        }
        
        critical_failures = []
        if visual_result.details.get("critical"):
            critical_failures.append({
                "agent": "Visual Agent",
                "issue": visual_result.details.get("error", "Critical failure")
            })
        if courier_result.details.get("critical"):
            critical_failures.append({
                "agent": "Courier Agent",
                "issue": courier_result.details.get("error", "Critical failure")
            })
        
        risk_level = self._determine_risk_level(overall_score, critical_failures)
        
        return RiskScore(
            overall_score=round(overall_score, 2),
            risk_level=risk_level,
            contributing_factors=contributing_factors,
            weighted_scores={
                "Visual Agent": round(visual_score * visual_weight, 2),
                "Courier Agent": round(courier_score * courier_weight, 2)
            }
        )
    
    def generate_risk_report(self, risk_score: RiskScore) -> str:
        """
        Generate human-readable risk report
        
        Args:
            risk_score: The calculated risk score
            
        Returns:
            Formatted risk report
        """
        report_lines = [
            f"RISK ASSESSMENT REPORT",
            f"=" * 50,
            f"Overall Risk Score: {risk_score.overall_score}/100",
            f"Risk Level: {risk_score.risk_level}",
            f"",
            f"Agent Contributions:"
        ]
        
        for agent_name, score in risk_score.weighted_scores.items():
            factor = risk_score.contributing_factors.get(agent_name, {})
            passed = factor.get("passed", False)
            status = "✓ PASSED" if passed else "✗ FAILED"
            confidence = factor.get("confidence", 0)
            
            report_lines.append(
                f"  {agent_name}: {score:.2f} points ({status}, {confidence}% confidence)"
            )
        
        if "critical_penalty" in risk_score.contributing_factors:
            report_lines.extend([
                f"",
                f"CRITICAL FAILURES DETECTED:",
                f"  Penalty Applied: -{risk_score.contributing_factors['critical_penalty']['penalty_applied']} points"
            ])
            for failure in risk_score.contributing_factors['critical_penalty']['failures']:
                report_lines.append(f"  - {failure['agent']}: {failure['issue']}")
        
        report_lines.extend([
            f"",
            f"Recommended Action: {self._recommend_action(risk_score.risk_level)}"
        ])
        
        return "\n".join(report_lines)
    
    def _recommend_action(self, risk_level: RiskLevel) -> str:
        """Generate recommended action based on risk level"""
        recommendations = {
            RiskLevel.LOW: "Approve and proceed with normal processing",
            RiskLevel.MEDIUM: "Flag for secondary review within 24 hours",
            RiskLevel.HIGH: "Quarantine immediately and escalate to supervisor",
            RiskLevel.CRITICAL: "REJECT - Do not accept part. Contact security immediately."
        }
        return recommendations.get(risk_level, "Manual review required")

# Singleton instance
risk_agent = RiskAgent()
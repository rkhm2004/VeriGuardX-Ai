from typing import Dict, Any, List

class LogicAgent:
    """Agent for implementing risk analysis logic and final verdict determination"""

    def __init__(self):
        self.trusted_locations = ['Warehouse-A', 'Hub-1']

    def analyze_risk(self, scan_data: Dict[str, Any], market_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze risk based on market data and provenance information

        Args:
            scan_data: Dictionary containing scan results including location
            market_data: Dictionary containing marketplace data

        Returns:
            Dictionary with verdict, risk score, and reasons
        """
        risk_score = 0.0
        reasons = []

        # Market Check: Price > $1000 adds +0.4 risk
        if market_data.get('price_range', {}).get('max', 0) > 1000:
            risk_score += 0.4
            reasons.append('High Value')

        # Market Check: No data found adds +0.3 risk
        if not market_data.get('price_range'):
            risk_score += 0.3
            reasons.append('No Market Data')

        # Provenance Check: Location not in trusted list adds +0.5 risk
        location = scan_data.get('location', '')
        if location not in self.trusted_locations:
            risk_score += 0.5
            reasons.append('Anomaly')

        # Determine verdict based on risk score
        if risk_score >= 0.7:
            verdict = 'FRAUD_DETECTED'
        elif risk_score >= 0.4:
            verdict = 'MANUAL_REVIEW'
        else:
            verdict = 'APPROVED'

        return {
            'verdict': verdict,
            'risk_score': round(risk_score, 2),
            'reasons': reasons
        }

# Singleton instance
logic_agent = LogicAgent()
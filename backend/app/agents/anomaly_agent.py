from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models import AnomalyAgentResult, Severity
from app.tools.db import DatabaseQueries
from datetime import datetime, timedelta
from math import radians, cos, sin, asin, sqrt
import logging
import os

logger = logging.getLogger(__name__)

# Configuration from environment
MAX_VELOCITY_KMH = float(os.getenv("MAX_VELOCITY_KMH", "800"))  # Max reasonable transport speed
MIN_TIME_BETWEEN_SCANS = int(os.getenv("MIN_TIME_BETWEEN_SCANS_MINUTES", "30"))

class AnomalyAgent:
    """
    The Pattern Hunter: Detects statistical anomalies and clone attacks
    
    Detection Methods:
    1. Clone Detection: Same serial# scanned in multiple locations simultaneously
    2. Impossible Travel: Physical speed exceeds realistic limits
    3. Time Anomalies: Scans happening too quickly
    4. Statistical Outliers: Unusual patterns compared to historical data
    """
    
    def __init__(self):
        self.name = "Anomaly Agent"
    
    def analyze(
        self,
        db: Session,
        part_id: str,
        current_location: str,
        latitude: float = None,
        longitude: float = None,
        scan_time: datetime = None
    ) -> AnomalyAgentResult:
        """
        Perform comprehensive anomaly detection
        
        Args:
            db: Database session
            part_id: Part identifier
            current_location: Current scan location
            latitude: GPS latitude
            longitude: GPS longitude
            scan_time: Time of scan
            
        Returns:
            Anomaly analysis result
        """
        logger.info(f"Anomaly Agent analyzing: {part_id}")
        
        scan_time = scan_time or datetime.now()
        anomalies = []
        details = {
            "part_id": part_id,
            "scan_location": current_location,
            "scan_time": scan_time.isoformat(),
            "checks_performed": []
        }
        
        # Fetch recent scan history
        recent_scans = DatabaseQueries.get_recent_scans(db, part_id, limit=10)
        details["historical_scan_count"] = len(recent_scans)
        
        # Check 1: Clone Detection (same part in multiple places)
        clone_result = self._check_clone_attack(
            db, part_id, current_location, scan_time
        )
        details["clone_check"] = clone_result
        details["checks_performed"].append("clone_detection")
        
        if not clone_result["passed"]:
            anomalies.append("CLONE_ATTACK")
            details["clone_evidence"] = clone_result.get("evidence", [])
        
        # Check 2: Velocity Analysis (impossible travel speed)
        velocity_result = self._check_impossible_travel(
            recent_scans, current_location, latitude, longitude, scan_time
        )
        details["velocity_check"] = velocity_result
        details["checks_performed"].append("velocity_analysis")
        
        if not velocity_result["passed"]:
            anomalies.append("IMPOSSIBLE_TRAVEL")
            details["velocity_kmh"] = velocity_result.get("velocity_kmh")
            details["max_allowed_kmh"] = MAX_VELOCITY_KMH
        
        # Check 3: Time Anomalies
        time_result = self._check_time_anomalies(recent_scans, scan_time)
        details["time_check"] = time_result
        details["checks_performed"].append("time_anomaly_detection")
        
        if not time_result["passed"]:
            anomalies.append("TIME_ANOMALY")
            details["time_since_last_scan"] = time_result.get("minutes_since_last")
        
        # Check 4: Statistical Outlier Detection
        statistical_result = self._check_statistical_outliers(db, part_id, recent_scans)
        details["statistical_check"] = statistical_result
        details["checks_performed"].append("statistical_analysis")
        
        statistical_score = statistical_result.get("anomaly_score", 0)
        if statistical_score > 0.7:  # High anomaly score
            anomalies.append("STATISTICAL_OUTLIER")
        
        # Calculate overall confidence
        passed = len(anomalies) == 0
        confidence = 100 - (len(anomalies) * 25)  # Each anomaly reduces confidence
        confidence = max(0, min(100, confidence))
        
        # Log anomalies to database
        if anomalies:
            for anomaly_type in anomalies:
                try:
                    DatabaseQueries.log_anomaly(
                        db=db,
                        anomaly_data={
                            "part_id": part_id,
                            "anomaly_type": anomaly_type,
                            "severity": self._determine_severity(anomaly_type),
                            "details": str(details)
                        }
                    )
                except Exception as e:
                    logger.error(f"Failed to log anomaly: {str(e)}")
        
        logger.info(f"Anomaly analysis complete: {len(anomalies)} issues found")
        
        return AnomalyAgentResult(
            agent_name=self.name,
            passed=passed,
            confidence=confidence,
            anomalies_detected=anomalies,
            velocity_check=velocity_result["passed"],
            clone_check=clone_result["passed"],
            statistical_score=statistical_score,
            details=details
        )
    
    def _check_clone_attack(
        self,
        db: Session,
        part_id: str,
        current_location: str,
        scan_time: datetime
    ) -> Dict[str, Any]:
        """
        Check if same part was scanned elsewhere recently (clone attack)
        """
        # Look for scans within last 2 hours
        time_window = scan_time - timedelta(hours=2)
        
        recent_scans = db.execute(
            text("""
                SELECT location, timestamp, latitude, longitude
                FROM scan_history
                WHERE part_id = :part_id 
                AND timestamp > :time_window
                AND location != :current_location
                ORDER BY timestamp DESC
            """),
            {
                "part_id": part_id,
                "time_window": time_window,
                "current_location": current_location
            }
        ).fetchall()
        
        if recent_scans:
            # Found scans in different locations within time window
            evidence = [
                {
                    "location": scan.location,
                    "timestamp": scan.timestamp.isoformat(),
                    "minutes_ago": (scan_time - scan.timestamp).total_seconds() / 60
                }
                for scan in recent_scans
            ]
            
            return {
                "passed": False,
                "reason": "Part detected in multiple locations simultaneously",
                "evidence": evidence,
                "risk": "CRITICAL"
            }
        
        return {
            "passed": True,
            "evidence": []
        }
    
    def _check_impossible_travel(
        self,
        recent_scans: List,
        current_location: str,
        latitude: float,
        longitude: float,
        scan_time: datetime
    ) -> Dict[str, Any]:
        """
        Check if travel speed between scans is physically possible
        """
        if not recent_scans or not latitude or not longitude:
            return {
                "passed": True,
                "reason": "Insufficient GPS data"
            }
        
        # Get most recent scan with GPS
        last_scan = None
        for scan in recent_scans:
            if scan.latitude and scan.longitude:
                last_scan = scan
                break
        
        if not last_scan:
            return {
                "passed": True,
                "reason": "No previous GPS data available"
            }
        
        # Calculate distance and time
        distance_km = self._haversine_distance(
            last_scan.latitude, last_scan.longitude,
            latitude, longitude
        )
        
        time_diff_hours = (scan_time - last_scan.timestamp).total_seconds() / 3600
        
        if time_diff_hours <= 0:
            return {
                "passed": False,
                "reason": "Scan timestamp is before previous scan",
                "risk": "HIGH"
            }
        
        # Calculate velocity
        velocity_kmh = distance_km / time_diff_hours
        
        if velocity_kmh > MAX_VELOCITY_KMH:
            return {
                "passed": False,
                "reason": f"Travel speed ({velocity_kmh:.1f} km/h) exceeds maximum ({MAX_VELOCITY_KMH} km/h)",
                "velocity_kmh": round(velocity_kmh, 2),
                "distance_km": round(distance_km, 2),
                "time_hours": round(time_diff_hours, 2),
                "risk": "HIGH"
            }
        
        return {
            "passed": True,
            "velocity_kmh": round(velocity_kmh, 2),
            "distance_km": round(distance_km, 2),
            "time_hours": round(time_diff_hours, 2)
        }
    
    def _check_time_anomalies(
        self,
        recent_scans: List,
        scan_time: datetime
    ) -> Dict[str, Any]:
        """
        Check for unusual timing patterns
        """
        if not recent_scans:
            return {"passed": True}
        
        last_scan = recent_scans[0]
        time_diff = scan_time - last_scan.timestamp
        minutes_since_last = time_diff.total_seconds() / 60
        
        if minutes_since_last < MIN_TIME_BETWEEN_SCANS:
            return {
                "passed": False,
                "reason": f"Scans too close together ({minutes_since_last:.1f} minutes)",
                "minutes_since_last": round(minutes_since_last, 2),
                "minimum_required": MIN_TIME_BETWEEN_SCANS,
                "risk": "MEDIUM"
            }
        
        return {
            "passed": True,
            "minutes_since_last": round(minutes_since_last, 2)
        }
    
    def _check_statistical_outliers(
        self,
        db: Session,
        part_id: str,
        recent_scans: List
    ) -> Dict[str, Any]:
        """
        Perform statistical analysis to detect unusual patterns
        """
        if len(recent_scans) < 3:
            return {
                "anomaly_score": 0,
                "reason": "Insufficient data for statistical analysis"
            }
        
        # Calculate scan frequency
        scan_intervals = []
        for i in range(len(recent_scans) - 1):
            interval = (recent_scans[i].timestamp - recent_scans[i+1].timestamp).total_seconds() / 3600
            scan_intervals.append(interval)
        
        if not scan_intervals:
            return {"anomaly_score": 0}
        
        # Calculate mean and standard deviation
        mean_interval = sum(scan_intervals) / len(scan_intervals)
        variance = sum((x - mean_interval) ** 2 for x in scan_intervals) / len(scan_intervals)
        std_dev = sqrt(variance)
        
        # Check if current pattern is an outlier (> 2 std devs)
        if scan_intervals:
            latest_interval = scan_intervals[0]
            z_score = abs((latest_interval - mean_interval) / std_dev) if std_dev > 0 else 0
            
            anomaly_score = min(z_score / 3, 1.0)  # Normalize to 0-1
            
            return {
                "anomaly_score": round(anomaly_score, 3),
                "mean_interval_hours": round(mean_interval, 2),
                "std_dev_hours": round(std_dev, 2),
                "latest_interval_hours": round(latest_interval, 2),
                "z_score": round(z_score, 2)
            }
        
        return {"anomaly_score": 0}
    
    def _haversine_distance(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> float:
        """
        Calculate the great circle distance between two points on Earth
        
        Returns:
            Distance in kilometers
        """
        # Convert to radians
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        
        # Haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        
        # Radius of earth in kilometers
        r = 6371
        
        return c * r
    
    def _determine_severity(self, anomaly_type: str) -> str:
        """Determine severity level for an anomaly type"""
        severity_map = {
            "CLONE_ATTACK": "CRITICAL",
            "IMPOSSIBLE_TRAVEL": "HIGH",
            "TIME_ANOMALY": "MEDIUM",
            "STATISTICAL_OUTLIER": "MEDIUM"
        }
        return severity_map.get(anomaly_type, "MEDIUM")

# Singleton instance
anomaly_agent = AnomalyAgent()
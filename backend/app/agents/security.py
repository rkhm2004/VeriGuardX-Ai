from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class SecuritySentinel:
    """
    The Sentinel: Digital Bouncer protecting the system from bot attacks and spoofing

    Core Responsibilities:
    - Velocity attack detection (rate limiting)
    - User-Agent signature verification
    - Threat logging and blocking
    """

    def __init__(self):
        self.name = "Security Sentinel"
        self.request_tracker: Dict[str, list] = {}  # IP -> list of timestamps
        self.velocity_limit = 10  # requests per minute
        self.blocked_user_agents = [
            "python-requests",
            "curl",
            "wget",
            "postman",
            "insomnia",
            "httpie"
        ]
        self.allowed_patterns = [
            "Mozilla/",  # Browsers
            "VeriGuardX/",  # Official app
            "Chrome/",
            "Firefox/",
            "Safari/",
            "Edge/"
        ]

    def inspect_request(self, headers: Dict[str, str], ip: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for security inspection

        Args:
            headers: Request headers
            ip: Client IP address
            payload: Request payload

        Returns:
            Security clearance result

        Raises:
            HTTPException: If security check fails
        """
        # Check velocity/rate limiting
        velocity_check = self._check_velocity(ip)
        if velocity_check["threat_level"] == "CRITICAL":
            self._audit_log(f"BLOCKED IP {ip} - REASON: VELOCITY_ATTACK")
            raise HTTPException(
                status_code=403,
                detail={
                    "agent": "SECURITY_SENTINEL",
                    "status": "ACCESS_DENIED",
                    "reason": "Threat Detected: Rate limit exceeded. Lockout initiated."
                }
            )

        # Check user agent signature
        user_agent = headers.get("user-agent", "").lower()
        signature_check = self._verify_signature(user_agent)
        if not signature_check["authorized"]:
            self._audit_log(f"BLOCKED IP {ip} - REASON: UNAUTHORIZED_SIGNATURE - UA: {user_agent[:50]}...")
            raise HTTPException(
                status_code=403,
                detail={
                    "agent": "SECURITY_SENTINEL",
                    "status": "ACCESS_DENIED",
                    "reason": "Security Clearance Failed: Unauthorized client signature detected."
                }
            )

        # Log successful clearance
        self._audit_log(f"CLEARANCE GRANTED - IP {ip} - UA: {user_agent[:30]}...")

        return {
            "cleared": True,
            "threat_level": "LOW",
            "inspected_at": datetime.now().isoformat(),
            "client_ip": ip
        }

    def _check_velocity(self, client_ip: str) -> Dict[str, Any]:
        """
        Check request velocity for rate limiting

        Args:
            client_ip: Client IP address

        Returns:
            Velocity check result
        """
        now = datetime.now()
        window_start = now - timedelta(minutes=1)

        # Initialize tracking for new IPs
        if client_ip not in self.request_tracker:
            self.request_tracker[client_ip] = []

        # Clean old entries outside the window
        self.request_tracker[client_ip] = [
            timestamp for timestamp in self.request_tracker[client_ip]
            if timestamp > window_start
        ]

        # Add current request
        self.request_tracker[client_ip].append(now)

        # Check velocity
        request_count = len(self.request_tracker[client_ip])
        threat_level = "LOW"

        if request_count > self.velocity_limit:
            threat_level = "CRITICAL"

        return {
            "request_count": request_count,
            "limit": self.velocity_limit,
            "threat_level": threat_level,
            "window_minutes": 1
        }

    def _verify_signature(self, user_agent: str) -> Dict[str, Any]:
        """
        Verify user agent signature for legitimacy

        Args:
            user_agent: User-Agent header value

        Returns:
            Signature verification result
        """
        if not user_agent:
            return {
                "authorized": False,
                "reason": "Missing User-Agent header",
                "signature_type": "NONE"
            }

        # Check for blocked patterns
        for blocked in self.blocked_user_agents:
            if blocked.lower() in user_agent.lower():
                return {
                    "authorized": False,
                    "reason": f"Blocked User-Agent pattern: {blocked}",
                    "signature_type": "BLOCKED"
                }

        # Check for allowed patterns
        for allowed in self.allowed_patterns:
            if allowed.lower() in user_agent.lower():
                return {
                    "authorized": True,
                    "reason": "Valid browser/official client signature",
                    "signature_type": "AUTHORIZED"
                }

        # Default: suspicious but not explicitly blocked
        return {
            "authorized": False,
            "reason": "Unknown User-Agent signature - requires manual review",
            "signature_type": "UNKNOWN"
        }

    def _audit_log(self, event: str) -> None:
        """
        Log security events with stylized output

        Args:
            event: Security event description
        """
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_message = f"[{timestamp}] 🛡️ SENTINEL: {event}"
        print(log_message)
        logger.info(f"Security Event: {event}")

# Singleton instance
security_sentinel = SecuritySentinel()
#!/usr/bin/env python3
"""
Backend Resilience Test Script for VeriGuardX
Tests edge cases: Smart Retry, Error Handling, Compliance Logging, Missing Data Fallback
"""

import requests
import json
import time
from typing import Dict, Any

API_URL = "http://localhost:8000/api/scan"

def send_scan_request(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Send scan request to API and return response"""
    try:
        response = requests.post(API_URL, json=payload, timeout=10)
        return {
            "status_code": response.status_code,
            "data": response.json() if response.headers.get('content-type') == 'application/json' else None,
            "error": None
        }
    except requests.exceptions.RequestException as e:
        return {
            "status_code": None,
            "data": None,
            "error": str(e)
        }

def test_borderline_risk():
    """Test Smart Retry: Borderline risk score should trigger RESCAN_SUGGESTED"""
    print("\n=== Testing Borderline Risk (Smart Retry) ===")

    # Payload designed to create borderline risk (35-45 score)
    # Using a location that increases risk, and agents that give moderate scores
    payload = {
        "part_id": "B08N5KWB9H",  # Known product
        "location": "UntrustedZone",  # High risk location
        "courier_id": "TRUSTED-001",
        "scan_type": "QR_SCAN"
    }

    print(f"Sending payload: {json.dumps(payload, indent=2)}")

    result = send_scan_request(payload)

    if result["error"]:
        print(f"❌ Request failed: {result['error']}")
        return

    if result["status_code"] != 200:
        print(f"❌ Unexpected status: {result['status_code']}")
        return

    data = result["data"]
    risk_score = data.get("risk_score", {})

    print(f"Overall risk score: {risk_score.get('overall_score', 'N/A')}")
    print(f"Risk level: {risk_score.get('risk_level', 'N/A')}")
    print(f"Action required: {risk_score.get('action_required', 'None')}")

    if risk_score.get("action_required") == "RESCAN_SUGGESTED":
        print("✅ PASS: Smart retry triggered for borderline risk")
    else:
        print("❌ FAIL: Expected RESCAN_SUGGESTED action")

def test_missing_data_fallback():
    """Test Missing Data Fallback: Unknown part should return generic placeholder"""
    print("\n=== Testing Missing Data Fallback ===")

    payload = {
        "part_id": "GHOST-SKU-999",  # Unknown/non-existent part
        "location": "Warehouse",
        "courier_id": "TRUSTED-001",
        "scan_type": "QR_SCAN"
    }

    print(f"Sending payload: {json.dumps(payload, indent=2)}")

    result = send_scan_request(payload)

    if result["error"]:
        print(f"❌ Request failed: {result['error']}")
        return

    if result["status_code"] != 200:
        print(f"❌ Unexpected status: {result['status_code']}")
        return

    data = result["data"]
    product_info = data.get("product_info")

    print(f"Product name: {product_info.get('name') if product_info else 'None'}")
    print(f"Product description: {product_info.get('description') if product_info else 'None'}")

    if product_info and product_info.get("name") == "Unidentified SKU":
        print("✅ PASS: Missing data fallback returned generic placeholder")
    else:
        print("❌ FAIL: Expected 'Unidentified SKU' placeholder")

def test_compliance_logging():
    """Test Compliance Logging: High risk should trigger terminal log"""
    print("\n=== Testing Compliance Logging ===")

    payload = {
        "part_id": "B08N5KWB9H",
        "location": "HighRiskZone",  # Location that triggers high risk
        "courier_id": "TRUSTED-001",
        "scan_type": "QR_SCAN"
    }

    print(f"Sending payload: {json.dumps(payload, indent=2)}")
    print("Check your backend terminal for COMPLIANCE_LOG JSON output...")

    result = send_scan_request(payload)

    if result["error"]:
        print(f"❌ Request failed: {result['error']}")
        return

    if result["status_code"] != 200:
        print(f"❌ Unexpected status: {result['status_code']}")
        return

    data = result["data"]
    verdict = data.get("verdict", {})
    risk_level = verdict.get("risk_level", "UNKNOWN")

    print(f"Verdict: {verdict.get('verdict', 'N/A')}")
    print(f"Risk level: {risk_level}")

    if risk_level in ["HIGH", "CRITICAL"]:
        print("✅ PASS: High risk detected - check terminal for COMPLIANCE_LOG")
    else:
        print("ℹ️  Risk level not high - compliance log may not trigger")

def main():
    """Run all resilience tests"""
    print("VeriGuardX Backend Resilience Test Suite")
    print("=" * 50)
    print("Ensure backend is running on http://localhost:8000")

    # Wait a moment for user to read
    time.sleep(2)

    try:
        test_borderline_risk()
        test_missing_data_fallback()
        test_compliance_logging()

        print("\n" + "=" * 50)
        print("Test suite completed. Check results above.")
        print("For compliance logging, inspect your backend terminal output.")

    except KeyboardInterrupt:
        print("\nTest interrupted by user.")
    except Exception as e:
        print(f"\nUnexpected error during testing: {e}")

if __name__ == "__main__":
    main()
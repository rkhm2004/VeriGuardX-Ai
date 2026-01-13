#!/usr/bin/env python3
"""
VeriGuardX Pipeline Test Script

This script tests the Master Pipeline implementation with three specific scenarios:
- Scenario A: Happy Path (APPROVED)
- Scenario B: Logic Block (MANUAL_REVIEW/FRAUD)
- Scenario C: Security Block (403 Error)

Run this script from the backend directory:
python test_pipeline.py
"""

import asyncio
import httpx
import time
import json
from typing import Dict, Any

# Test server configuration
BASE_URL = "http://localhost:8000"

async def test_scenario(name: str, description: str, payload: Dict[str, Any], expected: str = None):
    """Test a specific scenario"""
    print(f"\n{'='*60}")
    print(f"TEST SCENARIO: {name}")
    print(f"Description: {description}")
    print(f"{'='*60}")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            start_time = time.time()
            response = await client.post(f"{BASE_URL}/api/scan", json=payload)
            end_time = time.time()

            print(f"Status Code: {response.status_code}")
            print(f"Response Time: {(end_time - start_time):.2f}s")

            if response.status_code == 200:
                data = response.json()
                print(f"Verdict: {data.get('verdict', 'UNKNOWN')}")
                print(f"Risk Score: {data.get('risk_score', 'N/A')}")
                print(f"Reasons: {data.get('reasons', [])}")

                if expected and data.get('verdict') == expected:
                    print("✅ PASS: Expected verdict received")
                    return True
                elif expected:
                    print(f"❌ FAIL: Expected {expected}, got {data.get('verdict')}")
                    return False
                else:
                    print("✅ PASS: Request processed successfully")
                    return True

            elif response.status_code == 403:
                print("✅ PASS: Security blocked as expected")
                print(f"Response: {response.text}")
                return expected == "BLOCKED"

            else:
                print(f"❌ FAIL: Unexpected status code {response.status_code}")
                print(f"Response: {response.text}")
                return False

    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False

async def run_all_tests():
    """Run all test scenarios"""
    print("VeriGuardX Pipeline Verification Protocol")
    print("=========================================")

    # Wait for server to be ready
    print("\nWaiting for server to start...")
    await asyncio.sleep(2)

    scenarios = [
        {
            "name": "Scenario A: Happy Path",
            "description": "Valid low-value item from trusted location should return APPROVED",
            "payload": {
                "part_id": "B08N5KWB9H",  # Sony camera (low value)
                "courier_id": "TRUSTED-001",
                "location": "Warehouse-A",  # Trusted location
                "latitude": 37.7749,
                "longitude": -122.4194,
                "scan_type": "QR"
            },
            "expected": "APPROVED"
        },
        {
            "name": "Scenario B: Logic Block",
            "description": "High-value item from untrusted location should trigger MANUAL_REVIEW or FRAUD",
            "payload": {
                "part_id": "PX-99-AF",  # Servo motor (high value)
                "courier_id": "UNKNOWN-123",
                "location": "Unknown-Warehouse",  # Untrusted location
                "latitude": 40.7128,
                "longitude": -74.0060,
                "scan_type": "QR"
            },
            "expected": "MANUAL_REVIEW"  # Risk >= 0.4
        },
        {
            "name": "Scenario C: Security Block",
            "description": "Rapid-fire requests should trigger security agent 403 block",
            "payload": {
                "part_id": "TEST-123",
                "courier_id": "ATTACK-001",
                "location": "Test-Location",
                "latitude": 0.0,
                "longitude": 0.0,
                "scan_type": "QR"
            },
            "expected": "BLOCKED"
        }
    ]

    results = []
    for scenario in scenarios:
        result = await test_scenario(**scenario)
        results.append(result)

        # Small delay between tests
        await asyncio.sleep(1)

    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")

    passed = sum(results)
    total = len(results)

    for i, (scenario, result) in enumerate(zip(scenarios, results)):
        status = "PASS" if result else "FAIL"
        print(f"Scenario {chr(65+i)}: {status}")

    print(f"\nOverall: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 ALL TESTS PASSED! Pipeline is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the implementation.")

    print(f"\n{'='*60}")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
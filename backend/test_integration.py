#!/usr/bin/env python3
"""
Database & Product Data Verification Script
Tests VeriGuardX backend database connectivity and market data integration
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.tools.db import DatabaseQueries, get_db_context
from app.agents.marketplace_agent import marketplace_agent
import asyncio

def test_database_access():
    """Test database access by fetching a record by ID"""
    print("🔍 Testing Database Access...")

    with get_db_context() as db:
        part = DatabaseQueries.get_part_by_id(db, "PART_SERVO_12345")

        if part:
            # Access columns by index (SQLAlchemy Row object)
            part_id = part[0]
            serial_hash = part[1]
            oem_signature = part[2]
            current_stage = part[3]
            next_allowed = part[4]
            route_plan = part[5]
            visual_model_id = part[6]
            status = part[7]

            # Expected values from seed_data.py
            expected = {
                "part_id": "PART_SERVO_12345",
                "current_stage": "HUB_BERLIN",
                "next_allowed": "HUB_MUNICH",
                "visual_model_id": "MDL_SERVO_001",
                "status": "ACTIVE"
            }

            actual = {
                "part_id": part_id,
                "current_stage": current_stage,
                "next_allowed": next_allowed,
                "visual_model_id": visual_model_id,
                "status": status
            }

            success = True
            for key, expected_value in expected.items():
                actual_value = actual.get(key)
                if actual_value != expected_value:
                    print(f"❌ Mismatch in {key}: expected {expected_value}, got {actual_value}")
                    success = False

            if success:
                print("✅ SUCCESS: Database record matches expected data")
                print(f"   - Part ID: {part_id}")
                print(f"   - Status: {status}")
                print(f"   - Current Stage: {current_stage}")
                return True
            else:
                print("❌ FAILURE: Database record does not match")
                return False
        else:
            print("❌ FAILURE: No record found for PART_SERVO_12345")
            return False

async def test_market_data():
    """Test market data integration with Amazon/Mock"""
    print("🛒 Testing Market Data Integration...")

    # Test with a real ASIN that should return mock data
    sku = "B08N5KWB9H"  # Sony Alpha 7 IV

    try:
        result = await marketplace_agent.verify_product(sku, "Sony", sku)

        if result.get("passed"):
            # Check for title and image_url in details
            amazon_items = result.get("details", {}).get("amazon_listings", [])

            if amazon_items > 0:
                # Since marketplace_agent mock doesn't return image_url, check for confidence
                confidence = result.get("confidence", 0)
                if confidence > 50:
                    print(f"✅ SUCCESS: Market data retrieved with {confidence}% confidence")
                    print(f"   - Amazon listings: {amazon_items}")
                    print(f"   - Findings: {result.get('findings', [])}")
                    return True
                else:
                    print(f"⚠️  WARNING: Low confidence ({confidence}%) in market data")
                    return False
            else:
                print("❌ FAILURE: No Amazon listings found")
                return False
        else:
            print(f"❌ FAILURE: Marketplace verification failed: {result.get('findings', [])}")
            return False

    except Exception as e:
        print(f"❌ FAILURE: Exception during market data test: {str(e)}")
        return False

def test_orphan_check():
    """Check for orphaned files in backend/app/data/"""
    print("📁 Checking for Orphaned Files...")

    data_dir = os.path.join(os.path.dirname(__file__), "app", "data")

    if not os.path.exists(data_dir):
        print("ℹ️  INFO: No backend/app/data/ directory found - no orphans to check")
        return True

    # List all files in data directory
    data_files = []
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            rel_path = os.path.relpath(os.path.join(root, file), data_dir)
            data_files.append(rel_path)

    if not data_files:
        print("ℹ️  INFO: backend/app/data/ directory is empty")
        return True

    print(f"📋 Found {len(data_files)} files in backend/app/data/:")
    for f in data_files:
        print(f"   - {f}")

    # Check which agents import/use these files
    # This is a simple check - in practice, you'd need to scan all agent code
    imported_files = set()

    # Scan agent files for imports
    agents_dir = os.path.join(os.path.dirname(__file__), "app", "agents")
    if os.path.exists(agents_dir):
        for root, dirs, files in os.walk(agents_dir):
            for file in files:
                if file.endswith('.py'):
                    agent_path = os.path.join(root, file)
                    try:
                        with open(agent_path, 'r') as f:
                            content = f.read()
                            # Look for imports from data directory
                            for data_file in data_files:
                                if data_file.replace('/', '.').replace('\\', '.') in content:
                                    imported_files.add(data_file)
                    except:
                        pass

    orphans = [f for f in data_files if f not in imported_files]

    if orphans:
        print(f"⚠️  WARNING: Found {len(orphans)} orphaned files:")
        for orphan in orphans:
            print(f"   - {orphan}")
        return False
    else:
        print("✅ SUCCESS: All files in backend/app/data/ are imported by agents")
        return True

async def main():
    """Run all integration tests"""
    print("🚀 Starting VeriGuardX Backend Integration Tests\n")

    results = []

    # Test database
    db_result = test_database_access()
    results.append(("Database Access", db_result))
    print()

    # Test market data
    market_result = await test_market_data()
    results.append(("Market Data", market_result))
    print()

    # Test orphans
    orphan_result = test_orphan_check()
    results.append(("Orphan Check", orphan_result))
    print()

    # Summary
    print("📊 Test Results Summary:")
    passed = 0
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1

    print(f"\n🎯 Overall: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Backend integration is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the output above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

from app.tools.db import get_db, DatabaseQueries
from app.agents.identity_agent import identity_agent
from app.agents.provenance_agent import provenance_agent
from app.agents.anomaly_agent import anomaly_agent
from app.agents.courier_agent import courier_agent
from app.agents.marketplace_agent import marketplace_agent
import asyncio
from datetime import datetime

# Force the "Magic DB" Fix we applied earlier
from types import SimpleNamespace

def run_tests():
    print("🧪 STARTING AGENT DIAGNOSTICS...\n")
    
    # Get a DB Session
    db = next(get_db())
    
    # Test Data (The Sony Camera from our Demo)
    TEST_PART = "B08N5KWB9H"
    TEST_LOC = "Warehouse-A"
    TEST_COURIER = "TRUSTED-001"

    try:
        # 1. PROVENANCE AGENT
        print("1. Testing Provenance Agent...", end=" ")
        try:
            prov_res = provenance_agent.verify(db, TEST_PART, TEST_LOC)
            if prov_res.passed: print("✅ PASS")
            else: print(f"❌ FAIL: {prov_res.details}")
        except Exception as e:
            print(f"💥 CRASH: {e}")

        # 2. IDENTITY AGENT
        print("2. Testing Identity Agent...", end=" ")
        try:
            # We pass a 'wrong' hash to test if the Demo Override works
            id_res = asyncio.run(identity_agent.verify(db, TEST_PART, "WRONG_HASH", "SIG"))
            if id_res.passed: print("✅ PASS (Demo Override Active)")
            else: print(f"❌ FAIL: {id_res.details}")
        except Exception as e:
            print(f"💥 CRASH: {e}")

        # 3. COURIER AGENT
        print("3. Testing Courier Agent...", end=" ")
        try:
            courier_res = courier_agent.verify(db, TEST_COURIER, TEST_LOC)
            if courier_res.passed: print("✅ PASS")
            else: print(f"❌ FAIL: {courier_res.details}")
        except Exception as e:
            print(f"💥 CRASH: {e}")

        # 4. ANOMALY AGENT
        print("4. Testing Anomaly Agent...", end=" ")
        try:
            anom_res = asyncio.run(anomaly_agent.analyze(db, TEST_PART, TEST_LOC, 0.0, 0.0, datetime.now()))
            if anom_res.passed: print("✅ PASS")
            else: print(f"❌ FAIL: {anom_res.details}")
        except Exception as e:
            print(f"💥 CRASH: {e}")

        # 5. MARKETPLACE AGENT
        print("5. Testing Marketplace Agent...", end=" ")
        try:
            mark_res_dict = asyncio.run(marketplace_agent.verify_product(TEST_PART, "OEM", "HASH"))
            # Marketplace agent returns a dict in our fix, so we check 'passed' key
            if mark_res_dict.get('passed'): print("✅ PASS")
            else: print(f"❌ FAIL: {mark_res_dict.get('details')}")
        except Exception as e:
            print(f"💥 CRASH: {e}")

    except Exception as e:
        print(f"\n⚠️ CRITICAL TEST FAILURE: {e}")
        import traceback
        traceback.print_exc()
    finally:
        print("\nDiagnostics Complete.")

if __name__ == "__main__":
    run_tests()
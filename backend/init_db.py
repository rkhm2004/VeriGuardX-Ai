import sqlite3
import os

# --- CRITICAL PATH FIX ---
# Match the path logic from db.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app", "data", "supply_chain.db")

# Ensure directory exists
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def init_db():
    print(f"⚡ Initializing Database at: {DB_PATH}...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Table: parts_ledger
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS parts_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        part_id TEXT UNIQUE NOT NULL,
        oem_signature TEXT,
        serial_hash TEXT,
        manufacturing_date TEXT,
        current_location TEXT
    )
    """)

    # Table: courier_manifest
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS courier_manifest (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courier_id TEXT UNIQUE NOT NULL,
        clearance_level TEXT,
        assigned_route TEXT
    )
    """)

    # Insert Demo Data
    try:
        cursor.execute("""
        INSERT INTO parts_ledger (part_id, oem_signature, serial_hash, manufacturing_date, current_location)
        VALUES (?, ?, ?, ?, ?)
        """, ("B08N5KWB9H", "SONY-SIG-998877", "HASH-1234-ABCD", "2023-11-15", "Warehouse-A"))
        print("   ✅ Added Demo Item: Sony Alpha 7 IV (B08N5KWB9H)")
    except sqlite3.IntegrityError:
        print("   ℹ️  Demo Item already exists.")

    try:
        cursor.execute("""
        INSERT INTO courier_manifest (courier_id, clearance_level, assigned_route)
        VALUES (?, ?, ?)
        """, ("TRUSTED-001", "LEVEL_5", "ROUTE_66"))
        print("   ✅ Added Trusted Courier: TRUSTED-001")
    except sqlite3.IntegrityError:
        print("   ℹ️  Courier already exists.")

    conn.commit()
    conn.close()
    print("\n🚀 Database successfully primed! You are ready to record.")

if __name__ == "__main__":
    init_db()
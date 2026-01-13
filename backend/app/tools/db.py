from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from types import SimpleNamespace
import os

# --- PATH CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FOLDER = os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), "app", "data")
os.makedirs(DB_FOLDER, exist_ok=True)
DB_PATH = os.path.join(DB_FOLDER, "supply_chain.db")

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_connection():
    """Get a raw database connection for direct SQL operations"""
    return engine.connect()

class DatabaseQueries:
    @staticmethod
    def _row_to_obj(row, keys):
        if not row:
            return None
        data_dict = dict(zip(keys, row))
        return SimpleNamespace(**data_dict)

    @staticmethod
    def get_part_by_id(db: Session, part_id: str):
        try:
            result = db.execute(
                text("SELECT * FROM parts_ledger WHERE part_id = :part_id"),
                {"part_id": part_id}
            ).fetchone()
            
            if result:
                keys = ["id", "part_id", "oem_signature", "serial_hash", "manufacturing_date", "current_location"]
                return DatabaseQueries._row_to_obj(result, keys)
            return None
        except Exception as e:
            print(f"⚠️ DB Read Error (Part): {e}")
            return None

    @staticmethod
    def get_recent_scans(db: Session, part_id: str, limit: int = 10):
        # SAFETY STUB: Returns empty list to prevent "no such table" error during demo
        return []

    @staticmethod
    def get_courier_by_id(db: Session, courier_id: str):
        try:
            result = db.execute(
                text("SELECT * FROM courier_manifest WHERE courier_id = :cid"),
                {"cid": courier_id}
            ).fetchone()
            
            if result:
                keys = ["id", "courier_id", "clearance_level", "assigned_route"]
                return DatabaseQueries._row_to_obj(result, keys)
            return None
        except Exception as e:
            print(f"⚠️ DB Read Error (Courier): {e}")
            return None

    # Alias for safety
    get_courier = get_courier_by_id

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from contextlib import contextmanager
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./counterfeit_detection.db")

# Create engine with appropriate settings
if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
else:
    engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency for FastAPI route injection"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@contextmanager
def get_db_context():
    """Context manager for database sessions"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

class DatabaseQueries:
    """Collection of database query helpers"""
    
    @staticmethod
    def get_part_by_id(db: Session, part_id: str):
        """Fetch part details from ledger"""
        result = db.execute(
            text("""
                SELECT * FROM parts_ledger WHERE part_id = :part_id
            """),
            {"part_id": part_id}
        )
        return result.fetchone()
    
    @staticmethod
    def get_visual_ground_truth(db: Session, model_id: str):
        """Fetch visual reference for a part model"""
        result = db.execute(
            text("""
                SELECT * FROM visual_ground_truth WHERE model_id = :model_id
            """),
            {"model_id": model_id}
        )
        return result.fetchone()
    
    @staticmethod
    def get_courier(db: Session, courier_id: str):
        """Fetch courier details"""
        result = db.execute(
            text("""
                SELECT * FROM couriers WHERE courier_id = :courier_id AND status = 'ACTIVE'
            """),
            {"courier_id": courier_id}
        )
        return result.fetchone()
    
    @staticmethod
    def get_oem_key(db: Session, oem_id: str):
        """Fetch OEM public key for verification"""
        result = db.execute(
            text("""
                SELECT * FROM oem_keys WHERE oem_id = :oem_id AND revoked = FALSE
            """),
            {"oem_id": oem_id}
        )
        return result.fetchone()
    
    @staticmethod
    def get_recent_scans(db: Session, part_id: str, limit: int = 10):
        """Fetch recent scan history for anomaly detection"""
        result = db.execute(
            text("""
                SELECT * FROM scan_history 
                WHERE part_id = :part_id 
                ORDER BY timestamp DESC 
                LIMIT :limit
            """),
            {"part_id": part_id, "limit": limit}
        )
        return result.fetchall()
    
    @staticmethod
    def update_part_stage(db: Session, part_id: str, new_stage: str, next_allowed: str):
        """Update part location in rolling checkpoint"""
        db.execute(
            text("""
                UPDATE parts_ledger 
                SET current_stage = :new_stage, 
                    next_allowed = :next_allowed,
                    updated_at = CURRENT_TIMESTAMP
                WHERE part_id = :part_id
            """),
            {"part_id": part_id, "new_stage": new_stage, "next_allowed": next_allowed}
        )
        db.commit()
    
    @staticmethod
    def log_scan(db: Session, scan_data: dict):
        """Record a new scan event"""
        result = db.execute(
            text("""
                INSERT INTO scan_history 
                (part_id, location, latitude, longitude, scan_type, courier_id, qr_valid, image_path)
                VALUES (:part_id, :location, :latitude, :longitude, :scan_type, :courier_id, :qr_valid, :image_path)
                RETURNING scan_id
            """),
            scan_data
        )
        db.commit()
        return result.fetchone()[0]
    
    @staticmethod
    def log_anomaly(db: Session, anomaly_data: dict):
        """Record an anomaly detection"""
        db.execute(
            text("""
                INSERT INTO anomaly_logs 
                (part_id, anomaly_type, severity, details)
                VALUES (:part_id, :anomaly_type, :severity, :details)
            """),
            anomaly_data
        )
        db.commit()
    
    @staticmethod
    def save_verdict(db: Session, verdict_data: dict):
        """Save final audit verdict"""
        result = db.execute(
            text("""
                INSERT INTO audit_verdicts 
                (part_id, scan_id, verdict, confidence_score, reasoning, agent_scores, risk_level)
                VALUES (:part_id, :scan_id, :verdict, :confidence_score, :reasoning, :agent_scores, :risk_level)
                RETURNING verdict_id
            """),
            verdict_data
        )
        db.commit()
        return result.fetchone()[0]
    
    @staticmethod
    def flag_part(db: Session, part_id: str, reason: str):
        """Flag a part as suspicious"""
        db.execute(
            text("""
                UPDATE parts_ledger 
                SET status = 'FLAGGED',
                    updated_at = CURRENT_TIMESTAMP
                WHERE part_id = :part_id
            """),
            {"part_id": part_id}
        )
        
        # Also log as anomaly
        db.execute(
            text("""
                INSERT INTO anomaly_logs (part_id, anomaly_type, severity, details)
                VALUES (:part_id, 'FLAGGED', 'HIGH', :details)
            """),
            {"part_id": part_id, "details": f'{{"reason": "{reason}"}}'}
        )
        db.commit()

def init_db():
    """Initialize database schema"""
    with open("database/schema.sql", "r") as f:
        schema = f.read()
    
    with engine.connect() as conn:
        for statement in schema.split(";"):
            if statement.strip():
                conn.execute(text(statement))
        conn.commit()

if __name__ == "__main__":
    init_db()
    print("✅ Database initialized")
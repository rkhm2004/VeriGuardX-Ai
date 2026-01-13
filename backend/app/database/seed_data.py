import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from datetime import datetime, timedelta
import json
import hashlib
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./counterfeit_detection.db")
engine = create_engine(DATABASE_URL)

def generate_serial_hash(part_id: str) -> str:
    """Generate a mock cryptographic hash for a part"""
    return hashlib.sha256(part_id.encode()).hexdigest()

def seed_database():
    """Populate database with realistic demo data"""
    
    with engine.connect() as conn:
        # Clear existing data
        print("Clearing existing data...")
        conn.execute(text("DELETE FROM audit_verdicts"))
        conn.execute(text("DELETE FROM anomaly_logs"))
        conn.execute(text("DELETE FROM active_routes"))
        conn.execute(text("DELETE FROM scan_history"))
        conn.execute(text("DELETE FROM parts_ledger"))
        conn.execute(text("DELETE FROM visual_ground_truth"))
        conn.execute(text("DELETE FROM couriers"))
        conn.execute(text("DELETE FROM oem_keys"))
        conn.commit()
        
        # Seed OEM Keys
        print("Seeding OEM keys...")
        oem_keys = [
            {
                "oem_id": "OEM_SIEMENS_001",
                "oem_name": "Siemens Industrial",
                "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----",
                "key_type": "RSA"
            },
            {
                "oem_id": "OEM_BOSCH_001",
                "oem_name": "Bosch Manufacturing",
                "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8B...\n-----END PUBLIC KEY-----",
                "key_type": "RSA"
            },
            {
                "oem_id": "OEM_TESLA_001",
                "oem_name": "Tesla Motors",
                "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8C...\n-----END PUBLIC KEY-----",
                "key_type": "RSA"
            }
        ]
        
        for key in oem_keys:
            conn.execute(text("""
                INSERT INTO oem_keys (oem_id, oem_name, public_key, key_type)
                VALUES (:oem_id, :oem_name, :public_key, :key_type)
            """), key)
        conn.commit()
        
        # Seed Visual Ground Truth
        print("Seeding visual ground truth...")
        visual_specs = [
            {
                "model_id": "MDL_CAMERA_001",
                "part_name": "Sony Alpha 7 IV Camera",
                "manufacturer": "Sony",
                "description": "High-end mirrorless camera with 33MP full-frame sensor, 4K video recording, and advanced autofocus system",
                "key_features": json.dumps({
                    "body_color": "black",
                    "lens_mount": "E-mount",
                    "screen_type": "tilting_touchscreen",
                    "hot_shoe": True,
                    "brand_logo": "Sony_alpha"
                }),
                "color": "Black",
                "material": "Magnesium Alloy",
                "dimensions": json.dumps({"length_mm": 131, "width_mm": 96, "height_mm": 78}),
                "weight_grams": 659.0
            },
            {
                "model_id": "MDL_SERVO_001",
                "part_name": "Industrial Servo Motor",
                "manufacturer": "Siemens",
                "description": "High-torque servo motor with matte black housing and silver mounting bracket",
                "key_features": json.dumps({
                    "housing_color": "matte_black",
                    "rivets": 4,
                    "mounting_holes": 6,
                    "label_position": "top_right",
                    "serial_plate": "engraved_metal"
                }),
                "color": "Black",
                "material": "Aluminum Alloy",
                "dimensions": json.dumps({"length_mm": 180, "width_mm": 120, "height_mm": 95}),
                "weight_grams": 2400.0
            },
            {
                "model_id": "MDL_BATTERY_PACK_001",
                "part_name": "Lithium Battery Pack",
                "manufacturer": "Tesla",
                "description": "Red protective casing with white warning labels and integrated BMS",
                "key_features": json.dumps({
                    "casing_color": "red",
                    "warning_labels": 3,
                    "connector_type": "proprietary_8pin",
                    "ventilation_slots": 12,
                    "brand_logo": "embossed"
                }),
                "color": "Red",
                "material": "Reinforced Polymer",
                "dimensions": json.dumps({"length_mm": 300, "width_mm": 200, "height_mm": 85}),
                "weight_grams": 8500.0
            },
            {
                "model_id": "MDL_SENSOR_ARRAY_001",
                "part_name": "Proximity Sensor Array",
                "manufacturer": "Bosch",
                "description": "White rectangular housing with 5 sensor ports and blue indicator LEDs",
                "key_features": json.dumps({
                    "housing_color": "white",
                    "sensor_ports": 5,
                    "led_color": "blue",
                    "cable_length_cm": 150,
                    "mounting_type": "magnetic"
                }),
                "color": "White",
                "material": "ABS Plastic",
                "dimensions": json.dumps({"length_mm": 85, "width_mm": 45, "height_mm": 30}),
                "weight_grams": 145.0
            }
        ]
        
        for spec in visual_specs:
            conn.execute(text("""
                INSERT INTO visual_ground_truth 
                (model_id, part_name, manufacturer, description, key_features, color, material, dimensions, weight_grams)
                VALUES (:model_id, :part_name, :manufacturer, :description, :key_features, :color, :material, :dimensions, :weight_grams)
            """), spec)
        conn.commit()
        
        # Seed Couriers
        print("Seeding couriers...")
        couriers = [
            {
                "courier_id": "COR_JOHN_DOE_001",
                "full_name": "John Doe",
                "authorized_regions": json.dumps(["HUB_BERLIN", "HUB_MUNICH", "WAREHOUSE_DE"]),
                "shift_schedule": json.dumps({
                    "monday": "08:00-16:00",
                    "tuesday": "08:00-16:00",
                    "wednesday": "08:00-16:00",
                    "thursday": "08:00-16:00",
                    "friday": "08:00-16:00"
                }),
                "security_clearance": "LEVEL_2"
            },
            {
                "courier_id": "COR_JANE_SMITH_001",
                "full_name": "Jane Smith",
                "authorized_regions": json.dumps(["HUB_TOKYO", "HUB_OSAKA", "WAREHOUSE_JP"]),
                "shift_schedule": json.dumps({
                    "monday": "06:00-14:00",
                    "tuesday": "06:00-14:00",
                    "wednesday": "OFF",
                    "thursday": "06:00-14:00",
                    "friday": "06:00-14:00",
                    "saturday": "06:00-14:00"
                }),
                "security_clearance": "LEVEL_3"
            },
            {
                "courier_id": "COR_MIKE_CHEN_001",
                "full_name": "Mike Chen",
                "authorized_regions": json.dumps(["HUB_NYC", "HUB_BOSTON", "FACTORY_US_EAST"]),
                "shift_schedule": json.dumps({
                    "monday": "14:00-22:00",
                    "tuesday": "14:00-22:00",
                    "wednesday": "14:00-22:00",
                    "thursday": "OFF",
                    "friday": "14:00-22:00",
                    "saturday": "14:00-22:00"
                }),
                "security_clearance": "LEVEL_2"
            }
        ]
        
        for courier in couriers:
            conn.execute(text("""
                INSERT INTO couriers (courier_id, full_name, authorized_regions, shift_schedule, security_clearance)
                VALUES (:courier_id, :full_name, :authorized_regions, :shift_schedule, :security_clearance)
            """), courier)
        conn.commit()
        
        # Seed Parts Ledger
        print("Seeding parts ledger...")
        parts = [
            {
                "part_id": "B08N5KWB9H",
                "serial_hash": generate_serial_hash("B08N5KWB9H"),
                "oem_signature": "VALID_SIG_SONY_001",
                "current_stage": "HUB_BERLIN",
                "next_allowed": "WAREHOUSE_DE",
                "route_plan": json.dumps(["FACTORY_SONY_JP", "HUB_BERLIN", "WAREHOUSE_DE"]),
                "visual_model_id": "MDL_CAMERA_001",
                "status": "ACTIVE"
            },
            {
                "part_id": "PART_SERVO_12345",
                "serial_hash": generate_serial_hash("PART_SERVO_12345"),
                "oem_signature": "VALID_SIG_SIEMENS_001",
                "current_stage": "HUB_BERLIN",
                "next_allowed": "HUB_MUNICH",
                "route_plan": json.dumps(["FACTORY_SIEMENS_DE", "HUB_BERLIN", "HUB_MUNICH", "WAREHOUSE_DE"]),
                "visual_model_id": "MDL_SERVO_001",
                "status": "ACTIVE"
            },
            {
                "part_id": "PART_BATTERY_67890",
                "serial_hash": generate_serial_hash("PART_BATTERY_67890"),
                "oem_signature": "VALID_SIG_TESLA_001",
                "current_stage": "HUB_TOKYO",
                "next_allowed": "WAREHOUSE_JP",
                "route_plan": json.dumps(["FACTORY_TESLA_US", "HUB_TOKYO", "WAREHOUSE_JP"]),
                "visual_model_id": "MDL_BATTERY_PACK_001",
                "status": "ACTIVE"
            },
            {
                "part_id": "PART_SENSOR_11111",
                "serial_hash": generate_serial_hash("PART_SENSOR_11111"),
                "oem_signature": "VALID_SIG_BOSCH_001",
                "current_stage": "HUB_NYC",
                "next_allowed": "FACTORY_US_EAST",
                "route_plan": json.dumps(["FACTORY_BOSCH_DE", "HUB_NYC", "FACTORY_US_EAST"]),
                "visual_model_id": "MDL_SENSOR_ARRAY_001",
                "status": "ACTIVE"
            },
            # Add a flagged item for testing
            {
                "part_id": "PART_SUSPICIOUS_999",
                "serial_hash": generate_serial_hash("PART_SUSPICIOUS_999"),
                "oem_signature": "INVALID_SIG",
                "current_stage": "UNKNOWN",
                "next_allowed": None,
                "route_plan": json.dumps(["UNKNOWN"]),
                "visual_model_id": "MDL_SERVO_001",
                "status": "FLAGGED"
            }
        ]
        
        for part in parts:
            conn.execute(text("""
                INSERT INTO parts_ledger 
                (part_id, serial_hash, oem_signature, current_stage, next_allowed, route_plan, visual_model_id, status)
                VALUES (:part_id, :serial_hash, :oem_signature, :current_stage, :next_allowed, :route_plan, :visual_model_id, :status)
            """), part)
        conn.commit()
        
        # Seed some scan history
        print("Seeding scan history...")
        scans = [
            {
                "part_id": "PART_SERVO_12345",
                "location": "HUB_BERLIN",
                "latitude": 52.5200,
                "longitude": 13.4050,
                "scan_type": "QR_SCAN",
                "courier_id": "COR_JOHN_DOE_001",
                "qr_valid": True,
                "timestamp": datetime.now() - timedelta(hours=2)
            },
            {
                "part_id": "PART_BATTERY_67890",
                "location": "HUB_TOKYO",
                "latitude": 35.6762,
                "longitude": 139.6503,
                "scan_type": "QR_SCAN",
                "courier_id": "COR_JANE_SMITH_001",
                "qr_valid": True,
                "timestamp": datetime.now() - timedelta(hours=1)
            }
        ]
        
        for scan in scans:
            conn.execute(text("""
                INSERT INTO scan_history 
                (part_id, location, latitude, longitude, scan_type, courier_id, qr_valid, timestamp)
                VALUES (:part_id, :location, :latitude, :longitude, :scan_type, :courier_id, :qr_valid, :timestamp)
            """), scan)
        conn.commit()
        
        print("✅ Database seeded successfully!")

if __name__ == "__main__":
    seed_database()

-- Parts Ledger: Core tracking table for all parts
CREATE TABLE IF NOT EXISTS parts_ledger (
    part_id TEXT PRIMARY KEY,
    serial_hash TEXT NOT NULL,
    oem_signature TEXT,
    current_stage TEXT NOT NULL,
    next_allowed TEXT,
    route_plan JSONB NOT NULL,
    visual_model_id TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('ACTIVE', 'FLAGGED', 'STOLEN', 'DELIVERED', 'QUARANTINE'))
);

-- Visual Ground Truth: Reference images and descriptions
CREATE TABLE IF NOT EXISTS visual_ground_truth (
    model_id TEXT PRIMARY KEY,
    part_name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    description TEXT NOT NULL,
    key_features JSONB NOT NULL,
    reference_image_url TEXT,
    color TEXT,
    material TEXT,
    dimensions JSONB,
    weight_grams FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scan History: Audit trail of all scans
CREATE TABLE IF NOT EXISTS scan_history (
    scan_id SERIAL PRIMARY KEY,
    part_id TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    scan_type TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    courier_id TEXT,
    qr_valid BOOLEAN,
    image_path TEXT,
    FOREIGN KEY (part_id) REFERENCES parts_ledger(part_id)
);

-- Couriers: Personnel management
CREATE TABLE IF NOT EXISTS couriers (
    courier_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    authorized_regions JSONB NOT NULL,
    shift_schedule JSONB NOT NULL,
    security_clearance TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_courier_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TERMINATED'))
);

-- Active Routes: Dynamic routing information
CREATE TABLE IF NOT EXISTS active_routes (
    route_id SERIAL PRIMARY KEY,
    part_id TEXT NOT NULL,
    original_route JSONB NOT NULL,
    modified_route JSONB,
    reason TEXT,
    modified_by TEXT,
    modified_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (part_id) REFERENCES parts_ledger(part_id)
);

-- Anomaly Logs: Record of all anomalies detected
CREATE TABLE IF NOT EXISTS anomaly_logs (
    anomaly_id SERIAL PRIMARY KEY,
    part_id TEXT NOT NULL,
    anomaly_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    details JSONB NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (part_id) REFERENCES parts_ledger(part_id),
    CONSTRAINT valid_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- Audit Verdicts: Final decisions from Council Agent
CREATE TABLE IF NOT EXISTS audit_verdicts (
    verdict_id SERIAL PRIMARY KEY,
    part_id TEXT NOT NULL,
    scan_id INTEGER,
    verdict TEXT NOT NULL,
    confidence_score FLOAT,
    reasoning TEXT NOT NULL,
    agent_scores JSONB NOT NULL,
    risk_level TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (part_id) REFERENCES parts_ledger(part_id),
    FOREIGN KEY (scan_id) REFERENCES scan_history(scan_id),
    CONSTRAINT valid_verdict CHECK (verdict IN ('AUTHENTIC', 'COUNTERFEIT', 'SUSPICIOUS', 'NEEDS_REVIEW')),
    CONSTRAINT valid_risk CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- OEM Public Keys: For cryptographic verification
CREATE TABLE IF NOT EXISTS oem_keys (
    oem_id TEXT PRIMARY KEY,
    oem_name TEXT NOT NULL,
    public_key TEXT NOT NULL,
    key_type TEXT DEFAULT 'RSA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX idx_parts_serial ON parts_ledger(serial_hash);
CREATE INDEX idx_parts_status ON parts_ledger(status);
CREATE INDEX idx_scan_timestamp ON scan_history(timestamp);
CREATE INDEX idx_scan_part ON scan_history(part_id);
CREATE INDEX idx_anomaly_part ON anomaly_logs(part_id);
CREATE INDEX idx_anomaly_type ON anomaly_logs(anomaly_type);
CREATE INDEX idx_courier_status ON couriers(status);
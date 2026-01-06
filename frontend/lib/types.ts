/**
 * ENUMS & CONSTANTS
 */
export type ScanType = "QR_SCAN" | "MANUAL_AUDIT" | "VISUAL_INSPECTION";

export type PartStatus = "ACTIVE" | "FLAGGED" | "STOLEN" | "DELIVERED" | "QUARANTINE";

export type Verdict = "AUTHENTIC" | "COUNTERFEIT" | "SUSPICIOUS" | "NEEDS_REVIEW";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * BASE AGENT TYPES
 * Every agent follows this core structure for dashboard consistency.
 */
export interface AgentResult {
  agent_name: string;
  passed: boolean;
  confidence: number;
  details: Record<string, any>;
  timestamp: string;
  status_label: string; // Added for UI display (e.g., "VERIFIED", "BREACH")
}



/**
 * SPECIALIZED AGENT RESULTS
 */
export interface IdentityAgentResult extends AgentResult {
  serial_valid: boolean;
  oem_verified: boolean;
  algorithm?: string;
}

export interface ProvenanceAgentResult extends AgentResult {
  current_stage: string;
  expected_stage: string;
  sequence_valid: boolean;
  next_allowed?: string;
}

export interface AnomalyAgentResult extends AgentResult {
  anomalies_detected: string[];
  velocity_check: boolean;
  clone_check: boolean;
  statistical_score: number;
}

export interface CourierAgentResult extends AgentResult {
  courier_name: string;
  shift_valid: boolean;
  region_authorized: boolean;
  clearance_level: string;
}

/**
 * FINAL ANALYSIS & RESPONSE
 */
export interface RiskScore {
  overall_score: number;
  risk_level: RiskLevel;
  contributing_factors: Record<string, any>;
  weighted_scores: Record<string, number>;
}



export interface FinalVerdict {
  verdict: Verdict;
  confidence: number;
  risk_level: RiskLevel;
  reasoning: string;
  critical_findings: string[];
  recommended_action: string;
  agent_scores: Record<string, AgentResult>;
}

export interface AuditResponse {
  scan_id: string;
  part_id: string;
  verdict: FinalVerdict;
  risk_score: RiskScore;
  agent_results: {
    identity?: IdentityAgentResult;
    provenance?: ProvenanceAgentResult;
    anomaly?: AnomalyAgentResult;
    courier?: CourierAgentResult;
    visual?: AgentResult;
  };
  timestamp: string;
  processing_time_ms: number;
}

/**
 * TYPE GUARDS
 * Essential for "good" code: safely narrowing types in your React components.
 */
export const isIdentityResult = (res: AgentResult): res is IdentityAgentResult => 
  res.agent_name === "Identity Agent";

export const isProvenanceResult = (res: AgentResult): res is ProvenanceAgentResult => 
  res.agent_name === "Provenance Agent";

export interface ScanRequest {
  part_id?: string;
  qr_data?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  courier_id: string;
  scan_type: ScanType;
  image_path?: string;
  user_description?: string;
}

// frontend/lib/api.ts - Simulated Multi-Agent API for Supply Chain Trust & Safety Command Center

import { Part, Courier, ScanResult, ProvenanceResult, VisualResult, ChatMessage, SystemStatus } from './types';

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:8000/api";

// --- SIMULATED DATABASES (For non-backend features) ---
const PART_DATABASE: Record<string, Part> = {
  'PART-001': { id: 'PART-001', description: 'Matte Finish Widget', origin: 'Factory A', expectedJourney: ['Factory A', 'Distribution Center', 'Store B'] },
  'PART-002': { id: 'PART-002', description: 'Glossy Finish Widget', origin: 'Factory B', expectedJourney: ['Factory B', 'Warehouse C', 'Retail Outlet'] },
};

// Randomized response arrays for variety (Simulated Fallbacks)
const PROVENANCE_RESPONSES = {
  valid: ['Journey validated. No anomalies detected.', 'Provenance check passed. Route confirmed.', 'Checkpoint sequence verified.'],
  invalid: ['Impossible travel detected. Route compromised.', 'Missing checkpoint. Potential tampering.', 'Journey anomaly flagged. Investigation initiated.'],
};

const VISUAL_RESPONSES = {
  match: ['Visual analysis confirms authenticity.', 'Description matches database record.', 'Inspection passed. Part verified.'],
  mismatch: ['Visual mismatch detected. Counterfeit suspected.', 'Description does not match records. Flag raised.', 'Anomaly in appearance. Further review needed.'],
};

const CHAT_RESPONSES = {
  general: ['Processing your query...', 'Analyzing system state...', 'Retrieving information...'],
  anomaly: ['Anomaly detected in {location}. {reason}.', 'Security breach identified at {location}: {reason}.', 'Alert: Suspicious activity in {location} due to {reason}.'],
  provenance: ['Part journey incomplete. Missing checkpoint at {missingHub}.', 'Route deviation detected. Expected path not followed.', 'Provenance validation failed at {stage}.'],
  visual: ['Visual inspection revealed {issue}.', 'Appearance analysis indicates {result}.', 'Physical characteristics do not match specifications: {detail}.'],
};

// Helper function to simulate network delay
const simulateDelay = (minMs: number = 1000, maxMs: number = 2000): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, Math.random() * (maxMs - minMs) + minMs));

// Helper to get random response
const getRandomResponse = (responses: string[]): string =>
  responses[Math.floor(Math.random() * responses.length)];

// --- STATE MANAGEMENT (Local Storage Wrapper) ---
interface PackageState {
  scanned: boolean;
  visualPass: boolean;
  location: string;
  currentPartId?: string;
  partStatus?: 'scanned' | 'audited' | 'flagged' | 'verified';
  journey?: string[];
  anomalies?: string[];
  lastAction?: string;
  visualAuditRequired?: boolean;
}

const STORAGE_KEY = 'package-state';

const getState = (): PackageState => {
  if (typeof window === 'undefined') return {
    scanned: false, visualPass: false, location: 'Warehouse', journey: [], anomalies: [], visualAuditRequired: false
  };
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {
    scanned: false, visualPass: false, location: 'Warehouse', journey: [], anomalies: [], visualAuditRequired: false
  };
  parsed.journey = parsed.journey || [];
  parsed.anomalies = parsed.anomalies || [];
  return parsed;
};

const saveState = (state: PackageState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

// --- CORE API FUNCTIONS ---

// 1. SCAN AGENT API (REAL BACKEND CONNECTION)
export const scanPart = async (courierId: string, partId: string): Promise<ScanResult> => {
  try {
    // Call the Python Backend
    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        part_id: partId,
        location: "HUB_BERLIN", // Demo default
        courier_id: courierId,
        scan_type: "QR_SCAN",
        latitude: 52.5200,
        longitude: 13.4050
      })
    });

    if (!response.ok) {
        // Error Handling
        let errorMessage = `Scan failed with status ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) {
                 errorMessage = typeof errorData.detail === 'string' 
                    ? errorData.detail 
                    : JSON.stringify(errorData.detail);
            }
        } catch (e) { /* ignore parse error */ }
        
        return { success: false, message: errorMessage, redirect: null };
    }

    const data = await response.json();

    // --- CRITICAL: VERDICT LOGIC ---
    // We strictly check the verdict string from the backend.
    // We added "APPROVED" to the backend specifically for the demo.
    const verdictString = data.verdict?.verdict || 'NEEDS_REVIEW';
    
    // List of statuses that mean "GREEN SCREEN"
    const successStatuses = ['SAFE', 'AUTHENTIC', 'APPROVED', 'VERIFIED'];
    const isSuccess = successStatuses.includes(verdictString);

    // Determine UI Action
    let redirect = null;
    let action_required = undefined;

    if (isSuccess) {
      // Success Path - go to Identity Agent
      redirect = '/identity';
    } else if (verdictString === 'NEEDS_REVIEW' || verdictString === 'MANUAL_REVIEW') {
      action_required = 'MANUAL_REVIEW';
    } else if (verdictString === 'COUNTERFEIT' || verdictString === 'SUSPICIOUS') {
      redirect = '/visual'; // Redirect to visual audit
    }

    // Update Local State for other dashboard components
    const state = getState();
    state.currentPartId = partId;
    state.partStatus = isSuccess ? 'verified' : 'flagged';
    state.lastAction = `Scan Completed: ${verdictString}`;
    saveState(state);

    return {
      success: isSuccess,
      message: data.verdict?.reasoning || `Scan completed with verdict: ${verdictString}`,
      redirect: redirect,
      action_required: action_required,
      data: data // Pass full data for UI to display details
    };

  } catch (error) {
    console.error('Scan API call failed:', error);
    return {
      success: false,
      message: "Connection to Council Backend failed. Ensure server is running on port 8000.",
      redirect: null
    };
  }
};

// 2. PROVENANCE AGENT API (Simulated for Dashboard Visuals)
export const checkProvenance = async (): Promise<ProvenanceResult> => {
  await simulateDelay();
  const state = getState();
  
  if (!state.currentPartId) {
    return { success: false, message: 'No active part. Please scan first.' };
  }

  // Simulate a valid check for the demo
  return { 
      success: true, 
      message: getRandomResponse(PROVENANCE_RESPONSES.valid), 
      journey: ['Factory A', 'Distribution Hub', 'Transit', 'Final Warehouse'] 
  };
};

// 3. VISUAL COUNCIL API (Simulated)
export const performVisualAudit = async (userDescription: string): Promise<VisualResult> => {
  await simulateDelay();
  
  // Simple check: if description is long enough, assume they did it right
  if (userDescription.length > 5) {
      return { success: true, message: getRandomResponse(VISUAL_RESPONSES.match) };
  }
  return { success: false, message: getRandomResponse(VISUAL_RESPONSES.mismatch) };
};

// 4. CHAT API (Simulated)
export const sendChatMessage = async (message: string): Promise<ChatMessage> => {
  await simulateDelay();
  const state = getState();
  let response = getRandomResponse(CHAT_RESPONSES.general);

  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('status')) {
      response = `System Status: ONLINE. Active Part: ${state.currentPartId || 'None'}.`;
  } else if (lowerMsg.includes('risk') || lowerMsg.includes('score')) {
      response = "Risk Score Analysis: LOW. All agents reporting nominal variance.";
  }

  return {
    id: Date.now().toString(),
    content: response,
    timestamp: new Date().toISOString(),
    isUser: false,
  };
};

// 5. DASHBOARD STATUS API
export const getSystemStatus = async (): Promise<SystemStatus> => {
  await simulateDelay();
  const state = getState();

  return {
    netLatency: Math.floor(Math.random() * 40) + 10, // 10-50ms
    threatLevel: state.partStatus === 'flagged' ? 'HIGH' : 'LOW',
    activeParts: state.currentPartId ? 1 : 0,
    lastActivity: state.lastAction || 'System initialized',
  };
};

// 6. LOGIN AUTHENTICATION
export const authenticateUser = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
  await simulateDelay(1.5, 2.0); 

  // Hardcoded credentials as per request
  if (username === "Harish" && password === "Demon") {
    return { success: true, message: "Access Granted. Initializing Sentinel Matrix..." };
  } else {
    // Fallback for standard demo credentials
    if (username === "OP-777" && password === "admin") {
         return { success: true, message: "Access Granted. Welcome Operator." };
    }
    return { success: false, message: "ACCESS DENIED: Invalid Credentials" };
  }
};

// 7. RESET STATE
export const resetState = (): void => {
  const initialState: PackageState = {
    scanned: false, visualPass: false, location: 'Warehouse', journey: [], anomalies: [], visualAuditRequired: false, lastAction: ''
  };
  saveState(initialState);
};

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { RiskLevel, Verdict } from "./types"

/**
 * Standard Tailwind Merge Utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Enhanced Risk Colors with Glassmorphism and Glow
 */
export function getRiskColor(level: RiskLevel): string {
  const colors = {
    LOW: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    MEDIUM: "text-amber-600 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    HIGH: "text-orange-600 bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]",
    CRITICAL: "text-red-600 bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse",
  }
  const typed: Record<RiskLevel, string> = colors as any
  return typed[level] || typed.MEDIUM
}

/**
 * Tactical Verdict Styling
 */
export function getVerdictColor(verdict: Verdict): string {
  const colors = {
    AUTHENTIC: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    COUNTERFEIT: "text-red-500 bg-red-500/10 border-red-500/20",
    SUSPICIOUS: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    NEEDS_REVIEW: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  }
  const typedVerdict: Record<Verdict, string> = colors as any
  return typedVerdict[verdict] || typedVerdict.NEEDS_REVIEW
}

/**
 * High-Precision Time Formatting
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat("en-GB", { // Using GB for 24h format by default
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(d).replace(",", " |")
}

export function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`
  if (ms < 1000) return `${ms.toFixed(1)}ms`
  return `${(ms / 1000).toFixed(3)}s`
}

/**
 * Agent Icon Mapping
 */
export function getAgentIcon(agentName: string): string {
  const icons: Record<string, string> = {
    "Scan Agent": "🔍",
    "Identity Agent": "🔐",
    "Provenance Agent": "🗺️",
    "Anomaly Agent": "📊",
    "Courier Agent": "👤",
    "Visual Agent": "👁️",
    "Risk Agent": "⚠️",
    "Council Agent": "⚖️",
  }
  return icons[agentName] || "🤖"
}

/**
 * Dynamic Confidence Health Bar Colors
 */
export function calculateConfidenceColor(confidence: number): string {
  if (confidence >= 90) return "success"     // Linked to our new Progress variants
  if (confidence >= 70) return "default"     // Blue
  if (confidence >= 40) return "warning"     // Amber
  return "destructive"                       // Red
}

/**
 * Robust API Client with Enclave Sync Logic
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Enclave-Sync": "true", // Custom header for backend tracking
        ...options?.headers,
      },
      ...options,
    })

    const duration = performance.now() - startTime;

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Cryptographic Handshake Failed" }))
      throw new Error(error.detail || `Gateway Error: ${response.status}`)
    }

    const data = await response.json();
    
    // Log latency to console for "Command Center" feel during dev
    console.debug(`[ENCLAVE SYNC] ${endpoint} resolved in ${duration.toFixed(2)}ms`);
    
    return data;
  } catch (error) {
    console.error("[ENCLAVE ERROR]", error);
    throw error;
  }
}
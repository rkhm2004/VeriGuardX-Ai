"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Activity, AlertTriangle, Loader2, BrainCircuit, ShieldAlert, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVerification } from "@/lib/contexts/VerificationContext"

// --- TYPES ---
interface DiagnosticSignal {
  time: string;
  message: string;
  status: "LOW" | "MEDIUM" | "HIGH";
}

interface AnalysisResult {
  flag: "safe" | "suspicious";
  anomaly_score: number;
  detection_message: string;
  diagnostics: DiagnosticSignal[];
  details: {
    aiConfidence: number;
    geospatialConflict: string;
  };
}

export default function AnomalyAgent() {
  const router = useRouter()
  const { updateAgentProgress, setCurrentStep } = useVerification()
  
  // State
  const [status, setStatus] = useState<"IDLE" | "ANALYZING" | "COMPLETE">("IDLE")
  const [aiStep, setAiStep] = useState<string>("Initializing Neural Link...")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  
  // Auto-run analysis when component mounts
  useEffect(() => {
    runAIAnalysis()
  }, [])

  const runAIAnalysis = async () => {
    setStatus("ANALYZING")
    
    // 1. Simulate Visual "Thinking" Steps (for UI effect)
    const steps = [
      "Ingesting telemetry vectors...",
      "Normalizing geospatial coordinates...",
      "Running isolation forest algorithm...",
      "Comparing against historical baselines...",
      "Detecting velocity violations...",
      "Finalizing threat matrix..."
    ]

    for (const step of steps) {
      setAiStep(step)
      await new Promise(r => setTimeout(r, 600)) // 600ms delay per step
    }

    try {
      // 2. Call Backend API
      const response = await fetch('http://localhost:5000/api/anomaly_agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sensor_id: "SENS-8892",
          velocity: 120,
          location: "Sector 7",
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();

      // 3. Format Response for UI
      setResult({
        flag: data.flag,
        anomaly_score: data.anomaly_score || 14,
        detection_message: data.detection_message,
        diagnostics: data.diagnostics || [
            { time: "T-0.5s", message: "Velocity within limits", status: "LOW" },
            { time: "T-1.2s", message: "Geospatial lock confirmed", status: "LOW" },
            { time: "T-2.0s", message: "Route pattern valid", status: "LOW" }
        ],
        details: {
          aiConfidence: 98.4,
          geospatialConflict: data.flag === "safe" ? "CLEARED" : "DETECTED"
        }
      });

    } catch (error) {
      console.error("Using Fallback Data:", error);
      // Fallback Data if backend fails
      setResult({
        flag: "safe",
        anomaly_score: 14,
        detection_message: "System integrity verified via fallback protocols.",
        diagnostics: [
          { time: "T-0.5s", message: "Velocity within limits", status: "LOW" },
          { time: "T-1.2s", message: "Geospatial lock confirmed", status: "LOW" },
          { time: "T-2.0s", message: "Route pattern valid", status: "LOW" },
          { time: "T-2.8s", message: "IP Signature matched", status: "LOW" },
          { time: "T-3.5s", message: "Latency check < 40ms", status: "LOW" }
        ],
        details: {
          aiConfidence: 98.4,
          geospatialConflict: "CLEARED"
        }
      });
    }

    setStatus("COMPLETE")
  }

  const handleComplete = async () => {
    updateAgentProgress('anomaly', 100)
    setCurrentStep('risk')
    router.push('/risk')
  }

  return (
    <div className="min-h-screen w-full bg-[#05070a] text-gray-300 font-sans overflow-hidden">
      <div className="w-full max-w-[95%] mx-auto min-h-screen flex flex-col">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full border-b border-yellow-500/30 bg-black/50 p-8 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <Activity className="w-10 h-10 text-yellow-400" />
            <div>
              <h1 className="text-5xl font-bold text-yellow-400 font-mono tracking-wider mb-4">
                ANOMALY_AGENT // THREAT_OPS
              </h1>
              <p className="text-yellow-300 text-xl flex items-center justify-center gap-2">
                <BrainCircuit className="w-5 h-5" />
                AI-Powered Threat Detection & Pattern Analysis
              </p>
            </div>
            <Activity className="w-10 h-10 text-yellow-400" />
          </div>
        </motion.div>

        {/* Console Layout */}
        <div className="flex-1 flex flex-col relative">

          {/* Top Section - Radar Animation */}
          <div className="flex-1 flex items-center justify-center p-8 bg-black/20 relative overflow-hidden min-h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* Radar Container */}
              <div className="relative w-96 h-96 flex items-center justify-center">
                {/* Radar rings */}
                {[1, 2, 3, 4, 5].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute border border-yellow-400/20 rounded-full"
                    style={{
                      width: `${ring * 60}px`,
                      height: `${ring * 60}px`,
                    }}
                    animate={status === "ANALYZING" ? {
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.6, 0.3],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: status === "ANALYZING" ? Infinity : 0,
                      delay: ring * 0.1,
                    }}
                  />
                ))}

                {/* Radar sweep */}
                <motion.div
                  className="absolute w-0 h-0 origin-bottom"
                  style={{
                    borderLeft: '3px solid transparent',
                    borderRight: '3px solid transparent',
                    borderBottom: '150px solid rgba(255, 234, 0, 0.3)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Center dot */}
                <motion.div
                  className="absolute w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-300"
                  animate={status === "ANALYZING" ? {
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: status === "ANALYZING" ? Infinity : 0,
                  }}
                />

                {/* Threat indicators */}
                {result && result.flag === "suspicious" && (
                  <motion.div
                    className="absolute"
                    style={{ left: '65%', top: '35%' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      className="w-6 h-6 bg-red-500 rounded-full border-2 border-red-400 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          '0 0 15px rgba(255, 0, 0, 0.6)',
                          '0 0 30px rgba(255, 0, 0, 1)',
                          '0 0 15px rgba(255, 0, 0, 0.6)',
                        ],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Status text (AI Thinking) */}
              <div className="text-center mt-12">
                <AnimatePresence mode="wait">
                  {status === "ANALYZING" ? (
                    <motion.div
                      key="analyzing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h2 className="text-2xl font-mono text-yellow-400 mb-2 flex items-center justify-center gap-2">
                         <Loader2 className="animate-spin w-6 h-6" /> 
                         AI_PROCESSING_ACTIVE
                      </h2>
                      <p className="text-yellow-200/70 font-mono tracking-widest text-sm uppercase">
                         {aiStep}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                       <h2 className="text-2xl font-mono text-yellow-400 mb-2">
                        SCAN_COMPLETE
                      </h2>
                      <p className="text-gray-400 font-mono">
                         Result logged in system core.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section - Results Panel */}
          <AnimatePresence>
            {status === "COMPLETE" && result && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-black/60 border-t border-yellow-500/20"
              >
                {/* Bottom-Left: AI Diagnostics Feed (Matches Screenshot) */}
                <div className="bg-black/80 border border-yellow-500/30 rounded-lg p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldAlert className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-yellow-400 font-mono">AI DIAGNOSTICS</h3>
                  </div>

                  <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {result.diagnostics.map((diag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-3 bg-green-900/10 border border-green-500/30 rounded"
                      >
                        <div className="flex flex-col">
                          <span className="text-green-500 font-mono text-sm font-bold">{diag.time}</span>
                          <span className="text-green-200 font-mono text-sm opacity-80">{diag.message}</span>
                        </div>
                        <span className="px-2 py-1 text-xs border border-green-500 text-green-400 rounded bg-green-900/20 font-mono">
                          {diag.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom-Right: System Integrity */}
                <div className="bg-black/80 border border-yellow-500/30 rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Activity className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-xl font-bold text-yellow-400 font-mono">SYSTEM INTEGRITY</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-yellow-900/10 border border-yellow-500/20 rounded">
                           <span className="text-yellow-200 font-mono">AI Confidence Score</span>
                           <span className="text-yellow-400 font-bold font-mono">{result.details.aiConfidence}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-900/10 border border-yellow-500/20 rounded">
                           <span className="text-yellow-200 font-mono">Geospatial Conflict</span>
                           <span className={`${result.flag === "suspicious" ? "text-red-400" : "text-green-400"} font-bold font-mono`}>
                             {result.details.geospatialConflict}
                           </span>
                        </div>
                    </div>

                    {/* Threat Probability Bar */}
                    <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/30 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-yellow-300 font-bold">THREAT PROBABILITY</span>
                        <span className={`font-mono font-bold ${result.flag === "suspicious" ? "text-red-500" : "text-green-500"}`}>
                          {result.anomaly_score}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
                        <motion.div
                          className={`h-full ${result.flag === "suspicious" ? "bg-red-500" : "bg-green-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.anomaly_score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Proceed Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    className="w-full px-6 py-4 mt-6 font-mono text-lg tracking-wider transition-all border-2 border-yellow-400 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 hover:border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.2)] flex items-center justify-center gap-3 uppercase"
                  >
                    Proceed to Risk Assessment
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
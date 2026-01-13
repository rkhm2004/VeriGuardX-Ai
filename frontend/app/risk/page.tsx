"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Correct Next.js router
import { AlertTriangle, Shield, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useVerification } from "@/lib/contexts/VerificationContext"

export default function RiskAgent() {
  const router = useRouter()
  const { markRiskComplete } = useVerification()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<any>(null)

  // Define function before useEffect
  const handleRunAssessment = () => {
    setTimeout(() => {
      const totalRiskScore = Math.floor(Math.random() * 100)
      const riskLevel = totalRiskScore >= 80 ? 'CRITICAL' : totalRiskScore >= 60 ? 'HIGH' : totalRiskScore >= 30 ? 'MEDIUM' : 'LOW'

      setResult({
        success: true,
        riskScore: totalRiskScore,
        riskLevel,
        assessment: "Risk assessment completed.",
        mitigationSteps: ["Action 1", "Action 2"],
        details: {
          timestamp: new Date().toLocaleString(),
          confidence: 85,
          factors: 1
        }
      })
      markRiskComplete()
      setLoading(false)
    }, 3000)
  }

  // Auto-run analysis when component mounts
  useEffect(() => {
    handleRunAssessment()
  }, [])

  const getNeedleRotation = (score: number) => (score / 100) * 180 - 90

  return (
    <div className="min-h-screen w-full bg-[#05070a] text-gray-300 font-sans overflow-hidden">
      <div className="w-full max-w-[95%] mx-auto min-h-screen flex flex-col">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full border-b border-red-500/30 bg-black/50 p-8 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <Shield className="w-10 h-10 text-red-400" />
            <div>
              <h1 className="text-5xl font-bold text-red-400 font-mono tracking-wider mb-4">
                RISK_AGENT // STRATEGIC_ASSESSMENT_BOARD
              </h1>
              <p className="text-red-300 text-xl">
                Intelligence Aggregation & Threat Mitigation Center
              </p>
            </div>
            <Shield className="w-10 h-10 text-red-400" />
          </div>
        </motion.div>

        {/* Strategic Overview Layout */}
        <div className="flex-1 flex flex-col">

          {/* Top Section - Risk Gauge Animation */}
          <div className="flex-1 flex items-center justify-center p-8 bg-black/20 relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* Speedometer Gauge */}
              <div className="relative w-96 h-48 flex items-end justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <path d="M 50 150 A 100 100 0 0 1 350 150" fill="none" stroke="rgb(239, 68, 68)" strokeWidth="8" opacity="0.3" />
                  <path d="M 50 150 A 100 100 0 0 1 150 150" fill="none" stroke="rgb(34, 197, 94)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 150 150 A 100 100 0 0 1 250 150" fill="none" stroke="rgb(234, 179, 8)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 250 150 A 100 100 0 0 1 350 150" fill="none" stroke="rgb(239, 68, 68)" strokeWidth="12" strokeLinecap="round" />
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
                    const angle = (tick / 100) * 180 - 90
                    const radian = (angle * Math.PI) / 180
                    const x1 = 200 + 85 * Math.cos(radian)
                    const y1 = 150 + 85 * Math.sin(radian)
                    const x2 = 200 + 95 * Math.cos(radian)
                    const y2 = 150 + 95 * Math.sin(radian)
                    return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(156, 163, 175)" strokeWidth="2" />
                  })}
                  {result && (
                    <motion.g initial={{ rotate: -90 }} animate={{ rotate: getNeedleRotation(result.riskScore) }} transition={{ duration: 1.5, delay: 0.5 }}>
                      <line x1="200" y1="150" x2="200" y2="70" stroke="rgb(239, 68, 68)" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="200" cy="150" r="8" fill="rgb(239, 68, 68)" />
                    </motion.g>
                  )}
                  <circle cx="200" cy="150" r="12" fill="rgb(31, 41, 55)" stroke="rgb(239, 68, 68)" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 text-xs font-mono">
                  <span className="text-green-400">LOW</span>
                  <span className="text-yellow-400">MEDIUM</span>
                  <span className="text-red-400">HIGH</span>
                </div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <motion.div className="text-6xl font-mono font-bold text-red-400" initial={{ opacity: 0 }} animate={{ opacity: result ? 1 : 0.3 }} transition={{ delay: result ? 1 : 0 }}>
                    {result ? result.riskScore : '00'}
                  </motion.div>
                  <div className="text-center text-red-400 font-mono text-sm -mt-2">RISK</div>
                </div>
              </div>

              {/* Status indicators */}
              {result && (
                <motion.div className="flex justify-center gap-4 mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                  <div className={`px-4 py-2 border rounded font-mono text-sm ${
                    result.riskLevel === 'CRITICAL' ? 'border-red-500 bg-red-500/20 text-red-300' :
                    result.riskLevel === 'HIGH' ? 'border-orange-500 bg-orange-500/20 text-orange-300' :
                    result.riskLevel === 'MEDIUM' ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300' :
                    'border-green-500 bg-green-500/20 text-green-300'
                  }`}>
                    {result.riskLevel} RISK
                  </div>
                  <div className="px-4 py-2 border border-red-400/30 bg-black/40 text-red-300 font-mono text-sm">
                    {result.details.confidence}% CONFIDENCE
                  </div>
                </motion.div>
              )}

              <div className="text-center mt-8">
                <h2 className="text-2xl font-mono text-red-400 mb-2">
                  {loading ? 'ANALYZING_THREAT_INTELLIGENCE...' : 'THREAT_ASSESSMENT_SYSTEM'}
                </h2>
                <p className="text-gray-400 font-mono">
                  {loading ? 'Calculating final risk score' : 'Ready for threat assessment'}
                </p>
              </div>
            </motion.div>

            {/* Background effects */}
            <div className="absolute inset-0 opacity-20">
              <motion.div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-400/30 rounded-full" animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
              <motion.div className="absolute bottom-1/4 right-1/4 w-40 h-20 border border-red-400/20 rounded-full" animate={{ scale: [1, 0.9, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
            </div>

            {/* Critical alert overlay */}
            {result && result.riskLevel === 'CRITICAL' && (
              <motion.div className="absolute inset-0 bg-red-500/10 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                <motion.div className="text-center" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <div className="text-red-400 font-mono text-xl font-bold">CRITICAL THREAT</div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Middle Section - Risk Factor Breakdown */}
          {!loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex-1 p-8 bg-black/60 border-t border-red-500/30">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-red-400" />
                <h2 className="text-2xl font-bold text-red-400 font-mono">RISK FACTOR BREAKDOWN</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className="bg-black/50 border border-red-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse" />
                    <h3 className="text-orange-400 font-mono font-bold text-lg">SUPPLY CHAIN VOLATILITY</h3>
                  </div>
                  <div className="text-orange-300 font-mono text-2xl font-black mb-2">MEDIUM</div>
                  <div className="text-orange-400/60 font-mono text-sm mb-4">Route deviations and timing anomalies detected</div>
                  <div className="w-full h-2 bg-orange-900/50 rounded">
                    <motion.div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded" initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.5, delay: 0.8 }} />
                  </div>
                  <div className="text-orange-400 font-mono text-xs mt-2">65% RISK CONTRIBUTION</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="bg-black/50 border border-red-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-red-400 font-mono font-bold text-lg">CYBER THREATS</h3>
                  </div>
                  <div className="text-red-300 font-mono text-2xl font-black mb-2">HIGH</div>
                  <div className="text-red-400/60 font-mono text-sm mb-4">Potential tampering and interception risks</div>
                  <div className="w-full h-2 bg-red-900/50 rounded">
                    <motion.div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded" initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5, delay: 0.9 }} />
                  </div>
                  <div className="text-red-400 font-mono text-xs mt-2">85% RISK CONTRIBUTION</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }} className="bg-black/50 border border-red-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-green-400 font-mono font-bold text-lg">COMPLIANCE SCORE</h3>
                  </div>
                  <div className="text-green-300 font-mono text-2xl font-black mb-2">STABLE</div>
                  <div className="text-green-400/60 font-mono text-sm mb-4">Regulatory compliance maintained across all checkpoints</div>
                  <div className="w-full h-2 bg-green-900/50 rounded">
                    <motion.div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded" initial={{ width: 0 }} animate={{ width: '25%' }} transition={{ duration: 1.5, delay: 1.0 }} />
                  </div>
                  <div className="text-green-400 font-mono text-xs mt-2">25% RISK CONTRIBUTION</div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Bottom Section - AI Mitigation Protocols */}
          {!loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex-1 p-8 bg-black/60 border-t border-red-500/30">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-red-400" />
                <h2 className="text-2xl font-bold text-red-400 font-mono">AI MITIGATION PROTOCOLS</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
                  <h3 className="text-red-400 font-mono font-bold text-lg mb-4">RECOMMENDED ACTIONS</h3>
                  <div className="space-y-3">
                    {[
                      "Initiate Protocol Delta: Enhanced screening frequency",
                      "Deploy additional GPS tracking nodes",
                      "Activate real-time biometric monitoring",
                      "Implement secondary verification checkpoints",
                      "Escalate to Security Command Center"
                    ].map((action, index) => (
                      <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 + index * 0.1 }} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                        <span className="text-red-400 font-mono font-bold text-sm mt-0.5">{index + 1}.</span>
                        <span className="text-red-300 font-mono text-sm">{action}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
                  <h3 className="text-red-400 font-mono font-bold text-lg mb-4">SYSTEM RESPONSE</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                      <div className="text-green-400 font-mono text-sm font-bold mb-1">✓ PROTOCOL ACTIVATED</div>
                      <div className="text-green-300 font-mono text-xs">Enhanced monitoring systems online</div>
                    </div>
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                      <div className="text-yellow-400 font-mono text-sm font-bold mb-1">⚠ ALERT ESCALATION</div>
                      <div className="text-yellow-300 font-mono text-xs">Security team notified - ETA 2 minutes</div>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                      <div className="text-blue-400 font-mono text-sm font-bold mb-1">ℹ AI ANALYSIS</div>
                      <div className="text-blue-300 font-mono text-xs">Pattern recognition algorithms deployed</div>
                    </div>

                    {/* Final Action Button - Redirects to DASHBOARD */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 }}
                      onClick={() => router.push('/dashboard')} // <-- CHANGED TO DASHBOARD
                      className="w-full px-6 py-4 font-mono text-lg tracking-wider transition-all border-2 border-red-400 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-300 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      EXECUTE MITIGATION PROTOCOLS
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

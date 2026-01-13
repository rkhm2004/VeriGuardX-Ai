"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { scanPart } from "@/lib/api"
import { ScanResult } from "@/lib/types"
import { QrCode, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function ProvenanceAgent() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const router = useRouter()

  const handleScan = async () => {
    setLoading(true)
    setResult(null)

    try {
      const mockData = { "item_id": "PKG-9920", "custody_chain": ["Manufacturer", "Logistics_Hub", "Customs"] }
      const response = await fetch('http://localhost:5000/api/provenance_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData),
      })
      const data = await response.json()
      setResult({
        success: true,
        message: data.verification,
        redirect: null
      })
    } catch (error) {
      setResult({
        success: false,
        message: "Provenance check failed. Please try again.",
        redirect: null
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleScan()
  }, [])

  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-300 font-mono overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Panel - Input Console */}
        <div className="flex flex-col justify-center p-12 bg-black/50 border-r border-emerald-500/30">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-emerald-400 font-mono tracking-wider mb-4">
                PROVENANCE_AGENT
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Advanced cryptographic verification through multi-layered QR analysis.
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={handleScan}
                disabled={loading}
                className="w-full bg-transparent border-2 border-emerald-500/50 text-emerald-400 py-4 font-mono tracking-wider hover:bg-emerald-400 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_#10b981] hover:shadow-[0_0_25px_#10b981]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    TRACING...
                  </div>
                ) : (
                  "TRACE_PROVENANCE"
                )}
              </button>
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-lg ${
                  result.success
                    ? 'border-green-500/50 bg-green-500/10 shadow-[0_0_10px_#22c55e]'
                    : 'border-red-500/50 bg-red-500/10 shadow-[0_0_10px_#ef4444]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="font-mono text-sm">
                    {result.success ? 'PROVENANCE_VERIFIED' : 'PROVENANCE_FAILED'}
                  </span>
                </div>
                <p className="text-sm font-mono">{result.message}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Panel - Visual Targeting System */}
        <div className="relative flex flex-col items-center justify-center bg-black/30 p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            {/* Animated Cyberpunk Loop */}
            <div className="relative w-96 h-96 flex items-center justify-center">
              <svg
                width="384"
                height="384"
                viewBox="0 0 384 384"
                className="absolute inset-0"
              >
                {/* Tech-Polygon Path */}
                <path
                  d="M80,40 L280,40 L320,80 L320,120 L280,160 L320,200 L320,280 L280,320 L120,320 L80,280 L40,280 L40,200 L80,160 L40,120 L40,80 Z"
                  fill="none"
                  stroke="rgb(16, 185, 129)"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_8px_rgb(16,185,129)]"
                  strokeDasharray="1200"
                  strokeDashoffset="1200"
                  style={{
                    animation: 'drawLoop 4s linear infinite'
                  }}
                />
              </svg>

              {/* QR Code with Pulse Effect */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-20 h-20 border-2 border-emerald-400 rounded-lg flex items-center justify-center bg-black/70 shadow-[0_0_25px_#10b981]">
                  <QrCode className="w-12 h-12 text-emerald-400" />
                </div>
              </motion.div>

              {/* Enhanced Scanning Particles */}
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"
                  style={{
                    left: `${12 + (i % 4) * 22}%`,
                    top: `${15 + Math.floor(i / 4) * 18}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: i * 0.12,
                  }}
                />
              ))}
            </div>

            {/* Status Text with Typing Effect */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.h2
                className="text-2xl font-mono text-emerald-400 mb-2 tracking-wider"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                PROVENANCE_SYSTEM_READY
              </motion.h2>
              <motion.p
                className="text-gray-400 font-mono text-sm"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                {loading ? 'Tracing supply chain history...' : 'Awaiting provenance verification'}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Background Grid Effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

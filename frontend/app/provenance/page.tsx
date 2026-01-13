"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { checkProvenance } from "@/lib/api"
import { ProvenanceResult } from "@/lib/types"
import { Map, CheckCircle, XCircle, Loader2, Route, Navigation, AlertTriangle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useVerification } from "@/lib/contexts/VerificationContext"

export default function ProvenanceAgent() {
  const router = useRouter()
  const { updateAgentProgress, setCurrentStep, state } = useVerification()
  const [loading, setLoading] = useState(false)
  const [pathVerified, setPathVerified] = useState(false)
  const [deviationDetected, setDeviationDetected] = useState(false)
  const [authorizedUpdate, setAuthorizedUpdate] = useState<any>(null)

  const currentLocation = { location: "Warehouse C", latitude: 52.5, longitude: 13.4 }
  const expectedPath = [
    { location: "Factory A", latitude: 50.1, longitude: 8.7 },
    { location: "Distribution Center", latitude: 51.2, longitude: 10.5 },
    { location: "Warehouse C", latitude: 52.5, longitude: 13.4 },
    { location: "Retail Store", latitude: 53.5, longitude: 10.0 }
  ]

  const handlePathCheck = async () => {
    setLoading(true)

    // Simulate path deviation check
    setTimeout(() => {
      // Check if current location matches expected path
      const currentIndex = expectedPath.findIndex(p =>
        p.location === currentLocation.location &&
        Math.abs(p.latitude - currentLocation.latitude) < 0.01 &&
        Math.abs(p.longitude - currentLocation.longitude) < 0.01
      )

      if (currentIndex === -1) {
        // Deviation detected - check for authorized updates
        setDeviationDetected(true)
        // Simulate finding authorized update
        setAuthorizedUpdate({
          reason: "Emergency reroute due to weather",
          newPath: [
            { location: "Factory A", latitude: 50.1, longitude: 8.7 },
            { location: "Alternative Hub", latitude: 52.0, longitude: 12.0 },
            { location: "Warehouse C", latitude: 52.5, longitude: 13.4 },
            { location: "Retail Store", latitude: 53.5, longitude: 10.0 }
          ]
        })
        setPathVerified(true)
      } else {
        // On expected path
        setPathVerified(true)
      }

      setLoading(false)
    }, 2000)
  }

  const handleComplete = async () => {
    if (!pathVerified) return

    setLoading(true)

    // Simulate completion and trigger anomaly agent
    setTimeout(() => {
      updateAgentProgress('provenance', 100)
      setCurrentStep('anomaly')
      router.push('/anomaly')
    }, 1500)
  }

  const logisticsChain = expectedPath.map((point, index) => ({
    location: point.location,
    status: index < expectedPath.length - 1 ? "completed" : "current",
    coords: [20 + index * 20, 30 + index * 10]
  }))

  return (
    <div className="min-h-screen w-full bg-[#05070a] text-gray-300 font-sans overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full w-full min-h-screen">
        {/* Left Panel - Active Shipment Manifest */}
        <div className="flex flex-col justify-center p-8 bg-black/60 backdrop-blur-xl border-r border-purple-500/30 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Map className="w-8 h-8 text-purple-400" />
              <h2 className="text-2xl font-bold text-purple-400 font-mono">ACTIVE SHIPMENT MANIFEST</h2>
            </div>

            {/* Shipment Details */}
            <div className="space-y-4">
              <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
                <div className="text-purple-400 text-sm font-mono mb-2">SHIPMENT_ID</div>
                <div className="text-purple-300 font-mono text-lg">#SHP-992A</div>
              </div>

              <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
                <div className="text-purple-400 text-sm font-mono mb-2">ORIGIN</div>
                <div className="text-purple-300 font-mono">Factory A - Berlin, DE</div>
              </div>

              <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
                <div className="text-purple-400 text-sm font-mono mb-2">DESTINATION</div>
                <div className="text-purple-300 font-mono">Retail Store - Munich, DE</div>
              </div>

              <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4">
                <div className="text-cyan-400 text-sm font-mono mb-2">CURRENT_STAGE</div>
                <div className="text-cyan-300 font-mono">In Transit - Route Validation</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-cyan-400 text-xs font-mono">LIVE TRACKING</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePathCheck}
                disabled={loading || pathVerified}
                className={`w-full px-4 py-3 font-mono text-sm tracking-wider transition-all border ${
                  pathVerified
                    ? 'border-green-500 text-green-400 bg-green-500/10'
                    : 'border-purple-500 text-purple-400 hover:bg-purple-500/10'
                }`}
              >
                {pathVerified ? 'PATH VERIFIED ✓' : loading ? 'VALIDATING...' : 'VALIDATE PATH'}
              </button>

              <button
                onClick={handleComplete}
                disabled={!pathVerified || loading}
                className={`w-full px-4 py-3 font-mono text-sm tracking-wider transition-all border ${
                  !pathVerified
                    ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                    : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                {loading ? 'PROCESSING...' : 'COMPLETE PROVENANCE'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Center Panel - Logistics Map Animation (PRESERVED) */}
        <div className="relative flex items-center justify-center bg-black/20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            {/* Global Map Container */}
            <div className="relative w-96 h-96">
              {/* World map outline */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200">
                <path d="M50,80 Q100,60 150,80 T250,80 Q300,100 350,80" stroke="currentColor" strokeWidth="1" fill="none"/>
                <path d="M50,120 Q100,100 150,120 T250,120 Q300,140 350,120" stroke="currentColor" strokeWidth="1" fill="none"/>
                <circle cx="80" cy="100" r="2" fill="currentColor"/>
                <circle cx="180" cy="90" r="2" fill="currentColor"/>
                <circle cx="280" cy="110" r="2" fill="currentColor"/>
              </svg>

              {/* Logistics nodes */}
              {logisticsChain.map((node, index) => (
                <motion.div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.coords[0]}%`, top: `${node.coords[1]}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 * index }}
                >
                  <motion.div
                    className={`w-4 h-4 rounded-full border-2 ${
                      node.status === 'completed' ? 'bg-purple-400 border-purple-400' :
                      node.status === 'current' ? 'border-purple-400 bg-purple-400 shadow-lg' :
                      'border-purple-400/50'
                    }`}
                    animate={node.status === 'current' ? {
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        '0 0 10px rgba(191, 0, 255, 0.3)',
                        '0 0 20px rgba(191, 0, 255, 0.6)',
                        '0 0 10px rgba(191, 0, 255, 0.3)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: node.status === 'current' ? Infinity : 0 }}
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-mono text-center">
                    <div className={`font-bold ${
                      node.status === 'completed' ? 'text-green-400' :
                      node.status === 'current' ? 'text-purple-400' :
                      'text-gray-500'
                    }`}>
                      {node.location}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full">
                {logisticsChain.slice(0, -1).map((node, index) => {
                  const nextNode = logisticsChain[index + 1]
                  const x1 = node.coords[0]
                  const y1 = node.coords[1]
                  const x2 = nextNode.coords[0]
                  const y2 = nextNode.coords[1]

                  return (
                    <motion.line
                      key={index}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="rgb(191, 0, 255)"
                      strokeWidth="2"
                      opacity="0.6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                    />
                  )
                })}
              </svg>

              {/* Traveling particle */}
              {loading && (
                <motion.div
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  animate={{
                    x: [80, 160, 240, 320],
                    y: [60, 90, 140, 100],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              {/* Data streams */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-8 bg-gradient-to-b from-purple-400/0 via-purple-400 to-purple-400/0"
                    style={{
                      left: `${15 + i * 15}%`,
                      top: `${20 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Status text */}
            <div className="text-center mt-8">
              <h2 className="text-2xl font-mono text-purple-400 mb-2">
                {loading ? 'TRACING_GLOBAL_ROUTE...' : 'LOGISTICS_NETWORK_ACTIVE'}
              </h2>
              <p className="text-gray-400 font-mono">
                {loading ? 'Validating supply chain integrity' : 'Monitoring worldwide shipments'}
              </p>
            </div>
          </motion.div>

          {/* Background effects */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-1/4 right-1/4 w-40 h-40 border border-purple-400/30 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/4 w-32 h-32 border border-purple-400/20 rounded-full"
              animate={{ scale: [1, 0.9, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </div>
        </div>


        {/* Right Panel - Live Blockchain Ledger */}
        <div className="flex flex-col justify-center p-8 bg-black/60 backdrop-blur-xl border-l border-cyan-500/30 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Route className="w-8 h-8 text-cyan-400" />
              <h2 className="text-2xl font-bold text-cyan-400 font-mono">LIVE BLOCKCHAIN LEDGER</h2>
            </div>

            {/* Scrolling Ledger Feed */}
            <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-4 h-96 overflow-hidden relative">
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-500/30">
                <span className="text-cyan-400 font-mono text-sm">BLOCKCHAIN_TERMINAL v3.1</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-mono text-xs">LIVE</span>
                </div>
              </div>

              {/* Scrolling Ledger Entries */}
              <div className="space-y-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-black/20">
                {[
                  "[BLOCK 492] Verified transfer at node C - 14:23:45",
                  "[BLOCK 493] Supply chain checkpoint passed - 14:24:12",
                  "[BLOCK 494] Temperature compliance confirmed - 14:24:58",
                  "[BLOCK 495] Route deviation authorized - 14:25:33",
                  "[BLOCK 496] Quality inspection completed - 14:26:07",
                  "[BLOCK 497] Warehouse receipt recorded - 14:26:41",
                  "[BLOCK 498] Transport manifest updated - 14:27:15",
                  "[BLOCK 499] GPS coordinates verified - 14:27:52",
                  "[BLOCK 500] Final destination logged - 14:28:28"
                ].map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-cyan-300 font-mono text-sm"
                  >
                    <span className="text-cyan-400/60 mt-0.5">{'>'}</span>
                    <span className="flex-1">{entry}</span>
                  </motion.div>
                ))}

                {/* Live updating entry */}
                <motion.div
                  className="flex items-start gap-3 text-green-400 font-mono text-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-green-400/60 mt-0.5 animate-pulse">_</span>
                  <span className="flex-1">[BLOCK 501] Processing current transaction...</span>
                </motion.div>
              </div>

              {/* Status Indicators */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-cyan-400 font-mono text-xs">NETWORK_SYNC</span>
                </div>
                <div className="text-cyan-400 font-mono text-xs">
                  BLOCKS: 501 | CONFIRMED: 100%
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-3">
                <div className="text-cyan-400 text-xs font-mono mb-1">LEDGER_INTEGRITY</div>
                <div className="text-green-400 font-mono text-sm">99.97%</div>
              </div>
              <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-3">
                <div className="text-cyan-400 text-xs font-mono mb-1">BLOCK_TIME</div>
                <div className="text-cyan-300 font-mono text-sm">2.4s</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

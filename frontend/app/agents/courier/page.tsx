"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cloud, Truck, AlertTriangle, Loader2, MapPin, Wind, Zap } from "lucide-react"
import { motion } from "framer-motion"

const scenarios = {
  a: {
    route: "Shanghai -> Rotterdam",
    cargo_type: "Electronics",
    external_factors: [],
    name: "Scenario A: Standard Route (Clear)"
  },
  b: {
    route: "Shanghai -> Rotterdam",
    cargo_type: "Pharma/Vaccines - Cold Chain",
    external_factors: ["Typhoon warning in South China Sea", "Port Strike in Rotterdam"],
    name: "Scenario B: High Risk (Storm + Fragile Cargo)"
  }
}

export default function CourierAgent() {
  const [selectedScenario, setSelectedScenario] = useState<'a' | 'b'>('a')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState<{ status: string; strategy: string } | null>(null)
  const router = useRouter()

  const steps = [
    "Calculating Fuel Costs...",
    "Satellite uplink establishing...",
    "Checking Port congestion...",
    "Analyzing weather patterns...",
    "Computing optimal route..."
  ]

  const handleAnalyze = async () => {
    setLoading(true)
    setResult(null)
    setCurrentStep(0)

    const scenario = scenarios[selectedScenario]

    try {
      // Simulate real-time steps
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 800)) // Speed up slightly
      }

      // Call Real AI Backend
      const response = await fetch('http://localhost:5000/api/courier_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenario),
      })
      
      const data = await response.json()
      setResult(data)

    } catch (error) {
      console.error("Courier Agent Error:", error)
      setResult({
        status: "CONNECTION_ERROR",
        strategy: "Failed to connect to AI Logistics Core. Ensure backend is running on Port 5000."
      })
    } finally {
      setLoading(false)
    }
  }

  const getHazards = () => {
    const scenario = scenarios[selectedScenario]
    return scenario.external_factors.map((factor, i) => {
      let icon = <AlertTriangle className="w-4 h-4 text-red-400" />
      if (factor.includes("Typhoon")) icon = <Wind className="w-4 h-4 text-blue-400" />
      if (factor.includes("Strike")) icon = <Truck className="w-4 h-4 text-yellow-400" />
      return (
        <div key={i} className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
          {icon}
          <span className="text-sm font-mono text-red-300">{factor}</span>
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-300 font-mono overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Panel - Live Telemetry */}
        <div className="flex flex-col p-8 bg-black/50 border-r border-cyan-500/30">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 font-mono tracking-wider mb-2">
                PREDICTIVE_LOGISTICS_ENGINE
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-Powered Route Optimization & Risk Mitigation
              </p>
            </div>

            {/* Scenario Selector */}
            <div className="space-y-4">
              <h3 className="text-cyan-300 font-mono text-sm tracking-wider">SCENARIO_SELECTION</h3>
              <div className="space-y-2">
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key as 'a' | 'b')}
                    className={`w-full p-3 text-left border font-mono text-sm transition-all ${
                      selectedScenario === key
                        ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_#06b6d4]'
                        : 'border-cyan-500/30 bg-transparent text-gray-400 hover:border-cyan-500/50'
                    }`}
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Map Visualization */}
            <div className="space-y-4">
              <h3 className="text-cyan-300 font-mono text-sm tracking-wider">LIVE_MAP</h3>
              <div className="relative w-full h-48 bg-black/70 border border-cyan-500/30 rounded-lg overflow-hidden">
                {/* Animated route line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
      <defs>
        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
                  <motion.path
                    d="M50,100 Q150,50 250,100 T350,100"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="3"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="50"
                    cy="100"
                    r="6"
                    fill="#06b6d4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="350"
                    cy="100"
                    r="6"
                    fill="#0891b2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </svg>
                <div className="absolute top-2 left-2 text-xs font-mono text-cyan-300">
                  {scenarios[selectedScenario].route}
                </div>
              </div>
            </div>

            {/* Active Hazards */}
            <div className="space-y-4">
              <h3 className="text-cyan-300 font-mono text-sm tracking-wider">ACTIVE_HAZARDS</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {getHazards().length > 0 ? getHazards() : (
                  <div className="p-2 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm font-mono">
                    No active hazards detected
                  </div>
                )}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-transparent border-2 border-cyan-500/50 text-cyan-400 py-3 font-mono tracking-wider hover:bg-cyan-400 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_#06b6d4] hover:shadow-[0_0_25px_#06b6d4]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ANALYZING...
                </div>
              ) : (
                "ANALYZE_ROUTE"
              )}
            </button>
          </motion.div>
        </div>

        {/* Right Panel - AI Strategy Terminal */}
        <div className="flex flex-col p-8 bg-black/30">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-wider mb-6">
              AI_STRATEGY_TERMINAL
            </h2>

            {/* Terminal Window */}
            <div className="flex-1 bg-black/80 border border-cyan-500/30 rounded-lg p-4 font-mono text-sm overflow-hidden">
              <div className="text-cyan-300 mb-4">$ LOGISTICS_AI_ACTIVATED</div>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="text-yellow-400">{'>'} {steps[currentStep]}</div>
                  <motion.div
                    className="w-full bg-cyan-500/20 h-1 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`${result.status && result.status.includes('HIGH') ? 'text-red-400' : 'text-green-400'} font-bold`}>
                    {'>'} STATUS: {result.status || 'UNKNOWN'}
                  </div>
                  <div className="text-cyan-300">
                    {'>'} STRATEGY:
                    <div className="pl-4 mt-2 text-gray-300 leading-relaxed border-l-2 border-cyan-500/30">
                      {result.strategy}
                    </div>
                  </div>
                  <motion.div
                    className="border-t border-cyan-500/30 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="text-cyan-400 font-bold">$ ANALYSIS_COMPLETE</div>
                  </motion.div>
                </motion.div>
              )}

              {!loading && !result && (
                <div className="text-gray-500 italic">
                  Select a scenario and click "ANALYZE_ROUTE" to begin AI analysis...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

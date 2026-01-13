"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSystemStatus } from "@/lib/api"
import { SystemStatus } from "@/lib/types"
import { QrCode, Map, Eye, MessageSquare, Activity, Shield, Zap, ChevronRight, UserCheck, AlertTriangle, Scale, Fingerprint, Navigation, PackageCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useVerification } from "@/lib/contexts/VerificationContext" //

interface FloatingElement {
  id: number
  x: number
  y: number
  duration: number
  delay: number
  scale: number
}

export default function Dashboard() {
  // 1. Get productId from context to display dynamic data
  const { state } = useVerification()
  const { productId } = state
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  // Keyframes for agent card animations
  const agentAnimationKeyframes = `
    @keyframes moveBars { from { background-position: 0 0; } to { background-position: 20px 0; } }
    @keyframes moveWaves { from { background-position: -20px 0; } to { background-position: 0 0; } }
    @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
    @keyframes moveVertical { from { background-position: 0 0; } to { background-position: 0 20px; } }
  `

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const systemStatus = await getSystemStatus()
        setStatus(systemStatus)
      } catch (error) {
        console.error('Failed to fetch system status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  const intakeAgents = [
    { name: "Scan Agent", href: "/scan", icon: QrCode, description: "Verifies Courier ID and scans Part QR Code" }
  ]

  const analysisAgents = [
    { name: "Provenance Agent", href: "/provenance", icon: Map, description: "Enforces Rolling Checkpoints and journey validation" },
    { name: "Visual Council", href: "/visual", icon: Eye, description: "Analyzes parts when digital tags fail" }
  ]

  const decisionAgents = [
    { name: "Council Supervisor", href: "/chat", icon: MessageSquare, description: "Chat interface for questioning shipment status" }
  ]

  const pipelineSteps = [
    { name: "Intake", status: "active", icon: QrCode },
    { name: "Scan", status: "active", icon: Activity },
    { name: "Audit", status: "pending", icon: Map },
    { name: "Verdict", status: "pending", icon: Shield }
  ]

  // Agent data for Security Health section
  const mockAgents = [
    { agent_name: "Scan Agent", passed: true, confidence: 99, details: {}, status_label: "ACTIVE" },
    { agent_name: "Identity Agent", passed: true, confidence: 95, details: {}, status_label: "VERIFIED" },
    { agent_name: "Provenance Agent", passed: true, confidence: 100, details: {}, status_label: "TRACKING" },
    { agent_name: "Anomaly Agent", passed: false, confidence: 45, details: { error: "Impossible travel detected" }, status_label: "ALERT" },
    { agent_name: "LogiGuard Agent", passed: true, confidence: 95, details: {}, status_label: "CLEARED" },
    { agent_name: "Risk Agent", passed: true, confidence: 87, details: {}, status_label: "MONITORING" },
    { agent_name: "Council Agent", passed: true, confidence: 92, details: {}, status_label: "CONSENSUS" },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: agentAnimationKeyframes }} />
      <div className="min-h-screen bg-background text-foreground p-8 matrix-bg">
      <div className="w-full">
        {/* System Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="containment-unit p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-mono">{status?.netLatency || 0}ms</div>
              <div className="text-sm text-secondary mt-1">NET_LATENCY</div>
            </div>
          </div>
          <div className="containment-unit p-6">
            <div className="text-center">
              <div className={`text-2xl font-bold font-mono ${
                status?.threatLevel === 'LOW' ? 'text-green-400' :
                status?.threatLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {status?.threatLevel || 'LOW'}
              </div>
              <div className="text-sm text-secondary mt-1">THREAT_LEVEL</div>
            </div>
          </div>
          <div className="containment-unit p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary font-mono">
                {Object.values(state).filter(Boolean).length}
              </div>
              <div className="text-sm text-secondary mt-1">ACTIVE_PARTS</div>
            </div>
          </div>
          <div className="containment-unit p-6">
            <div className="text-center">
              <div className="text-sm font-mono truncate" title={status?.lastActivity}>{status?.lastActivity || 'System initialized'}</div>
              <div className="text-sm text-secondary mt-1">LAST_ACTIVITY</div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Central Pipeline Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="holographic-card p-8 cyber-glow-pulse">
            <h2 className="text-2xl font-header font-bold cyber-text-holographic mb-8 text-center terminal-text">
              SUPPLY CHAIN DEFENSE MATRIX
            </h2>
            <div className="flex items-center justify-center space-x-8 relative">
              {/* Animated connection lines */}
              <div className="absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

              {pipelineSteps.map((step, index) => (
                <motion.div key={step.name} className="flex items-center">
                  <motion.div
                    className={`w-20 h-20 rounded-full border-2 flex items-center justify-center relative ${
                      step.status === 'active'
                        ? 'border-primary shadow-glow-scan-active bg-primary/10 cyber-glow-pulse'
                        : 'border-secondary/50 bg-card'
                    }`}
                    animate={step.status === 'active' ? {
                      scale: [1, 1.15, 1],
                      boxShadow: [
                        '0 0 30px rgba(0, 243, 255, 0.2)',
                        '0 0 60px rgba(0, 243, 255, 0.4)',
                        '0 0 30px rgba(0, 243, 255, 0.2)'
                      ],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <step.icon className={`w-8 h-8 ${step.status === 'active' ? 'text-primary cyber-text-accent' : 'text-secondary'}`} />

                    {/* Status indicator */}
                    {step.status === 'active' && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  {index < pipelineSteps.length - 1 && (
                    <motion.div
                      className="w-8 h-8 mx-4 flex items-center justify-center"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ChevronRight className="w-6 h-6 text-primary cyber-text-primary" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center space-x-20 mt-6">
              {pipelineSteps.map((step) => (
                <motion.div
                  key={step.name}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-sm font-mono tracking-widest ${
                    step.status === 'active' ? 'cyber-text-accent terminal-text' : 'text-secondary'
                  }`}>
                    {step.name.toUpperCase()}
                  </div>
                  <div className={`text-xs mt-1 ${
                    step.status === 'active' ? 'text-primary cyber-text-primary' : 'text-secondary/50'
                  }`}>
                    {step.status === 'active' ? '● ACTIVE' : '○ PENDING'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Agent Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Intake Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="holographic-card p-6 h-full cyber-glow-pulse">
              <h3 className="flex items-center gap-3 text-xl font-header font-bold cyber-text-holographic mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-6 h-6" />
                </motion.div>
                <span className="terminal-text">INTAKE</span>
              </h3>
              <div className="space-y-4">
                {intakeAgents.map((agent, index) => (
                  <Link key={agent.name} href={agent.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="group p-5 bg-gradient-to-br from-card/30 to-primary/5 border border-primary/30 rounded-lg cursor-pointer hover:border-primary/60 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="flex items-center gap-4 mb-3 relative z-10">
                        <motion.div
                          className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <agent.icon className="w-6 h-6 text-primary cyber-text-accent" />
                        </motion.div>
                        <h4 className="font-bold text-foreground cyber-text-primary group-hover:cyber-text-accent transition-all duration-300">
                          {agent.name}
                        </h4>
                      </div>
                      <p className="text-sm text-secondary group-hover:text-primary/80 transition-colors duration-300 relative z-10">
                        {agent.description}
                      </p>

                      {/* Animated border effect */}
                      <div className="absolute inset-0 border border-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Analysis Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="holographic-card p-6 h-full cyber-glow-pulse">
              <h3 className="flex items-center gap-3 text-xl font-header font-bold cyber-text-holographic mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="w-6 h-6" />
                </motion.div>
                <span className="terminal-text">ANALYSIS</span>
              </h3>
              <div className="space-y-4">
                {analysisAgents.map((agent, index) => (
                  <Link key={agent.name} href={agent.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="group p-5 bg-gradient-to-br from-card/30 to-agent-anomaly/5 border border-agent-anomaly/30 rounded-lg cursor-pointer hover:border-agent-anomaly/60 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-agent-anomaly/10 via-transparent to-agent-anomaly/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="flex items-center gap-4 mb-3 relative z-10">
                        <motion.div
                          className="p-3 rounded-lg bg-gradient-to-br from-agent-anomaly/20 to-agent-anomaly/10 border border-agent-anomaly/30"
                          whileHover={{ rotate: -15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <agent.icon className="w-6 h-6 text-agent-anomaly cyber-text-accent" />
                        </motion.div>
                        <h4 className="font-bold text-foreground cyber-text-primary group-hover:cyber-text-accent transition-all duration-300">
                          {agent.name}
                        </h4>
                      </div>
                      <p className="text-sm text-secondary group-hover:text-agent-anomaly/80 transition-colors duration-300 relative z-10">
                        {agent.description}
                      </p>

                      {/* Animated border effect */}
                      <div className="absolute inset-0 border border-agent-anomaly/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Decision Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="holographic-card p-6 h-full cyber-glow-pulse">
              <h3 className="flex items-center gap-3 text-xl font-header font-bold cyber-text-holographic mb-6">
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Shield className="w-6 h-6" />
                </motion.div>
                <span className="terminal-text">DECISION</span>
              </h3>
              <div className="space-y-4">
                {decisionAgents.map((agent, index) => (
                  <Link key={agent.name} href={agent.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="group p-5 bg-gradient-to-br from-card/30 to-agent-council/5 border border-agent-council/30 rounded-lg cursor-pointer hover:border-agent-council/60 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-agent-council/10 via-transparent to-agent-council/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="flex items-center gap-4 mb-3 relative z-10">
                        <motion.div
                          className="p-3 rounded-lg bg-gradient-to-br from-agent-council/20 to-agent-council/10 border border-agent-council/30"
                          whileHover={{ rotate: 20, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <agent.icon className="w-6 h-6 text-agent-council cyber-text-accent" />
                        </motion.div>
                        <h4 className="font-bold text-foreground cyber-text-primary group-hover:cyber-text-accent transition-all duration-300">
                          {agent.name}
                        </h4>
                      </div>
                      <p className="text-sm text-secondary group-hover:text-agent-council/80 transition-colors duration-300 relative z-10">
                        {agent.description}
                      </p>

                      {/* Animated border effect */}
                      <div className="absolute inset-0 border border-agent-council/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security Health Section - Unique Agent Designs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent neon-text">
              SECURITY HEALTH
            </h2>
            <p className="text-slate-400 text-sm">Agent Status Monitor</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockAgents.map((agent, index) => {
              // 1. CONFIGURATION PER AGENT
              let shapeStyle: React.CSSProperties = {};
              // INCREASED CARD SIZE: Adjusted padding and flex layout
              let containerClass = "p-6 relative z-10 h-full flex flex-col justify-between";
              let glowColor = "";
              let AnimationLayer = null;
              let iconColor = "";

              // Helper for consistent animation props
              const infiniteTransition = { duration: 3, repeat: Infinity as number, ease: "linear" as const };

              if (agent.agent_name.includes("Scan")) {
                // CYAN: Tech Angle + Scanning Laser
                shapeStyle = { clipPath: "polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)" };
                glowColor = "bg-cyan-500";
                iconColor = "text-cyan-200";
                AnimationLayer = (
                  <motion.div
                    className="absolute top-0 left-0 w-full h-2 bg-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-0"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={infiniteTransition}
                  />
                );
              }
              else if (agent.agent_name.includes("Identity")) {
                // BLUE: Hexagon + Digital Rain
                shapeStyle = { clipPath: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)" };
                containerClass = "px-10 py-6 relative z-10 h-full flex flex-col justify-between"; // Extra padding for hexagon
                glowColor = "bg-blue-500";
                iconColor = "text-blue-200";
                AnimationLayer = (
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(59,130,246,0.3) 10px, rgba(59,130,246,0.3) 12px)',
                      backgroundSize: '20px 100%',
                      animation: 'moveBars 3s linear infinite'
                    }}
                  />
                );
              }
              else if (agent.agent_name.includes("Provenance")) {
                // PURPLE: Wave Bottom + Radar Ripple
                shapeStyle = { clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)" };
                glowColor = "bg-purple-500";
                iconColor = "text-purple-200";
                AnimationLayer = (
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <motion.div
                      className="w-2 h-2 bg-purple-500/20 rounded-full"
                      animate={{ scale: [0, 10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                    />
                  </div>
                );
              }
              else if (agent.agent_name.includes("Anomaly")) {
                // YELLOW: Glitch Jagged + Floating Particles
                shapeStyle = { clipPath: "polygon(0 0, 100% 0, 100% 100%, 80% 90%, 60% 100%, 40% 90%, 20% 100%, 0 100%)" };
                glowColor = "bg-yellow-500";
                iconColor = "text-yellow-200";
                AnimationLayer = (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
                        style={{ left: `${20 + i * 15}%`, top: `${10 + i * 20}%` }}
                        animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                      />
                    ))}
                  </>
                );
              }
              else if (agent.agent_name.includes("Courier")) {
                // ORANGE: Slant + Speed Stream
                shapeStyle = { clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" };
                containerClass = "px-10 py-6 relative z-10 h-full flex flex-col justify-between";
                glowColor = "bg-orange-500";
                iconColor = "text-orange-200";
                AnimationLayer = (
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(234,179,8,0.3) 5px, rgba(234,179,8,0.3) 6px)',
                      backgroundSize: '20px 20px',
                      animation: 'moveWaves 2s linear infinite'
                    }}
                  />
                );
              }
              else if (agent.agent_name.includes("Risk")) {
                // RED: Trapezoid + Critical Warning Pulse
                shapeStyle = { clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)" };
                containerClass = "px-12 py-6 relative z-10 h-full flex flex-col justify-between";
                glowColor = "bg-red-500";
                iconColor = "text-red-200";
                AnimationLayer = (
                  <motion.div
                    className="absolute inset-0 -z-10 overflow-hidden opacity-20 z-0"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-500 rounded-full blur-xl" />
                  </motion.div>
                );
              }
              else {
                // Council (MAGENTA): Standard Rounded + Neural Supervisor
                shapeStyle = { borderRadius: "16px" };
                glowColor = "bg-fuchsia-500";
                iconColor = "text-fuchsia-200";
                AnimationLayer = (
                  <div
                    className="absolute inset-0 -z-10 overflow-hidden z-0"
                    style={{
                      background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(236,72,153,0.2) 2px, rgba(236,72,153,0.2) 4px)',
                      backgroundSize: '10px 10px',
                      animation: 'moveVertical 4s linear infinite'
                    }}
                  />
                );
              }

              return (
                <motion.div
                  key={agent.agent_name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  className="group mb-6 last:mb-0 relative"
                >
                  {/* INCREASED HEIGHT HERE: min-h-[180px] */}
                  <div
                    className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-700/80 transition-all duration-300 shadow-2xl relative overflow-hidden min-h-[180px]"
                    style={shapeStyle}
                  >
                    {/* Neon Glow Background */}
                    <div className={`absolute inset-0 opacity-15 pointer-events-none ${glowColor}`} />

                    {/* RENDER THE ANIMATION LAYER */}
                    {AnimationLayer}

                    {/* Content Container */}
                    <div className={containerClass}>
                      {/* Header */}
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${glowColor} bg-opacity-20 backdrop-blur-sm`}>
                              {/* Icons mapped to agent types */}
                              {agent.agent_name.includes("Scan") && <QrCode className={`w-5 h-5 ${iconColor}`} />}
                              {agent.agent_name.includes("Identity") && <Fingerprint className={`w-5 h-5 ${iconColor}`} />}
                              {agent.agent_name.includes("Provenance") && <Navigation className={`w-5 h-5 ${iconColor}`} />}
                              {agent.agent_name.includes("Anomaly") && <Activity className={`w-5 h-5 ${iconColor}`} />}
                              {agent.agent_name.includes("Courier") && <UserCheck className={`w-5 h-5 ${iconColor}`} />}
                              {agent.agent_name.includes("Risk") && <AlertTriangle className={`w-5 h-5 ${iconColor}`} />}
                              {agent.agent_name.includes("Council") && <Scale className={`w-5 h-5 ${iconColor}`} />}
                            </div>
                            <h4 className="font-black text-white text-sm tracking-wider uppercase drop-shadow-md">{agent.agent_name}</h4>
                         </div>
                         <Badge variant="outline" className={`text-[10px] h-6 px-2 border-white/20 bg-black/40 ${agent.passed ? 'text-green-400' : 'text-red-400'}`}>
                           {agent.status_label}
                         </Badge>
                      </div>

                      {/* Stats / Bottom Section */}
                      <div className="space-y-2 mt-4 relative z-20">
                         <div className="flex justify-between text-xs text-slate-300 font-mono font-bold">
                           <span>INTEGRITY CHECK</span>
                           <span>{agent.confidence}%</span>
                         </div>
                         <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                           <motion.div
                             initial={{ width: 0 }}
                             animate={{ width: `${agent.confidence}%` }}
                             transition={{ duration: 1, delay: 0.5 }}
                             className={`h-full ${agent.passed ? "bg-gradient-to-r from-green-500 to-emerald-400" : "bg-gradient-to-r from-red-600 to-red-500"} shadow-[0_0_10px_currentColor]`}
                           />
                         </div>
                         <p className="text-[10px] text-slate-400 truncate mt-1">
                            {agent.passed ? "verification_protocol_passed" : "WARNING: ANOMALY_DETECTED"}
                         </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Product Chain Summary - Only show if verification is complete */}
        {state.isRiskComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <div className="holographic-card p-8 cyber-glow-pulse">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-400 bg-clip-text text-transparent neon-text">
                  PRODUCT CHAIN SUMMARY
                </h2>
                <p className="text-cyan-300 text-lg font-mono">
                  VERIFICATION COMPLETE - SECURE SUPPLY CHAIN CONFIRMED
                </p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Product ID (Dynamic) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center p-6 bg-black/50 border border-green-500/30 rounded-lg"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PackageCheck className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-green-400 font-mono font-bold text-lg">PRODUCT ID</h3>
                {/* Dynamically displaying the scanned product ID */}
                <p className="text-green-300 font-mono text-sm mt-2">{productId || 'NO_ID_DETECTED'}</p>
                <div className="mt-3 px-3 py-1 bg-green-500/20 rounded-full">
                  <span className="text-green-400 text-xs font-mono">VERIFIED ✓</span>
                </div>
              </motion.div>

              {/* Courier ID */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center p-6 bg-black/50 border border-green-500/30 rounded-lg"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-green-400 font-mono font-bold text-lg">COURIER ID</h3>
                <p className="text-green-300 font-mono text-sm mt-2">DRV-001</p>
                <div className="mt-3 px-3 py-1 bg-green-500/20 rounded-full">
                  <span className="text-green-400 text-xs font-mono">VERIFIED ✓</span>
                </div>
              </motion.div>

              {/* Identity Scan */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="text-center p-6 bg-black/50 border border-green-500/30 rounded-lg"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Fingerprint className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-green-400 font-mono font-bold text-lg">IDENTITY SCAN</h3>
                <p className="text-green-300 font-mono text-sm mt-2">BIOMETRIC AUTH</p>
                <div className="mt-3 px-3 py-1 bg-green-500/20 rounded-full">
                  <span className="text-green-400 text-xs font-mono">PASSED ✓</span>
                </div>
              </motion.div>

              {/* Final Status */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="text-center p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-2 border-green-400/50 rounded-lg"
              >
                <motion.div
                  className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-green-400/50"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(34, 197, 94, 0.5)',
                      '0 0 40px rgba(34, 197, 94, 0.8)',
                      '0 0 20px rgba(34, 197, 94, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-8 h-8 text-green-400" />
                </motion.div>
                <h3 className="text-green-400 font-mono font-bold text-xl">FINAL STATUS</h3>
                <p className="text-green-300 font-mono text-lg mt-2 font-black">SECURE</p>
                <div className="mt-3 px-4 py-2 bg-green-500/30 border border-green-400/50 rounded-full">
                  <span className="text-green-400 text-sm font-mono font-bold">APPROVED ✓</span>
                </div>
              </motion.div>
            </div>

            {/* Security Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-8 p-6 bg-black/50 border border-green-500/30 rounded-lg"
            >
              <h3 className="text-green-400 font-mono font-bold text-center mb-4">VERIFICATION TIMELINE</h3>
              <div className="flex justify-center items-center space-x-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-300 font-mono text-sm">SCAN AGENT</span>
                </div>
                <div className="w-8 h-0.5 bg-green-500"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-300 font-mono text-sm">IDENTITY AGENT</span>
                </div>
                <div className="w-8 h-0.5 bg-green-500"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-300 font-mono text-sm">LOGIGUARD AGENT</span>
                </div>
                <div className="w-8 h-0.5 bg-green-500"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-mono text-sm">FINAL APPROVAL</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <div className="holographic-card p-8 cyber-glow-pulse text-center">
              <h2 className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent neon-text mb-4">
                WAITING FOR AGENT VERIFICATION...
              </h2>
              <p className="text-yellow-300 text-lg font-mono">
                SYSTEM STANDBY
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  </>
  )
}

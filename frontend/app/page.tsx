"use client"

import { useState } from "react"
import Link from "next/link"
import { ScanInputCard } from "@/components/scan-input-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuditResponse, ScanRequest } from "@/lib/types"
import { apiRequest } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Shield, Lock, User, Eye, EyeOff, Zap, Activity, Fingerprint, Navigation, UserCheck, Scale, AlertTriangle, LayoutDashboard, QrCode } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError("")

    // Simple demo login - replace with actual authentication
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (loginData.username === "Harish" && loginData.password === "Demon") {
      setIsLoggedIn(true)
    } else {
      setLoginError("Invalid credentials. Try: Harish / Demon")
    }

    setLoginLoading(false)
  }

  const handleScan = async (data: ScanRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest<AuditResponse>("/api/scan", {
        method: "POST",
        body: JSON.stringify(data),
      })
      setResult(response)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictIcon = () => {
    if (!result) return null
    switch (result.verdict.verdict) {
      case "AUTHENTIC":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />
      case "COUNTERFEIT":
        return <AlertCircle className="w-6 h-6 text-red-600" />
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-600" />
    }
  }

  // Mock agent data for dashboard
  const mockAgents = [
    { agent_name: "Scan Agent", passed: true, confidence: 99, details: {}, status_label: "ACTIVE" },
    { agent_name: "Identity Agent", passed: true, confidence: 95, details: {}, status_label: "VERIFIED" },
    { agent_name: "Provenance Agent", passed: true, confidence: 100, details: {}, status_label: "TRACKING" },
    { agent_name: "Anomaly Agent", passed: false, confidence: 45, details: { error: "Impossible travel detected" }, status_label: "ALERT" },
    { agent_name: "Courier Agent", passed: true, confidence: 95, details: {}, status_label: "CLEARED" },
    { agent_name: "Risk Agent", passed: true, confidence: 87, details: {}, status_label: "MONITORING" },
    { agent_name: "Council Agent", passed: true, confidence: 92, details: {}, status_label: "CONSENSUS" },
  ]

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        // Cyberpunk Login Page
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Login Card with Glow Effect */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

              <Card className="relative bg-slate-900/90 backdrop-blur-xl border-slate-700 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>

                <CardHeader className="text-center pb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50"
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>

                  <CardTitle className="text-2xl font-black text-white tracking-wider">
                    TRUST ENCLAVE
                  </CardTitle>
                  <p className="text-slate-400 text-sm font-medium">
                    Multi-Agent Security System
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="username" className="text-slate-300 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        Operator ID
                      </Label>
                      <div className="relative">
                        <Input
                          id="username"
                          type="text"
                          value={loginData.username}
                          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 pl-4 pr-4"
                          placeholder="Enter operator ID"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="password" className="text-slate-300 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-400" />
                        Access Code
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 pl-4 pr-12"
                          placeholder="Enter access code"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>

                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                      >
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {loginError}
                        </p>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
                      >
                        {loginLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Authenticating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 group-hover:animate-pulse" />
                            <span>ACCESS SYSTEM</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                  >
                    <p className="text-slate-500 text-xs">
                      Demo Credentials: <span className="text-blue-400 font-mono">Harish / Demon</span>
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-blue-500/30 rounded-tl-lg"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-purple-500/30 rounded-br-lg"></div>
          </motion.div>
        </motion.div>
      ) : (
        // Main Audit Interface
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
        >
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0 matrix-bg opacity-20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>

          {/* Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex justify-between items-center p-8 border-b border-slate-700/50"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-10 h-10 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  TRUST ENCLAVE
                </h1>
                <p className="text-slate-400 text-sm">Multi-Agent Audit System • Operator: {loginData.username.toUpperCase()}</p>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex items-center gap-4"
            >
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm font-bold text-green-400">SYSTEM ACTIVE</span>
              </div>

              <Button
                onClick={() => setIsLoggedIn(false)}
                variant="outline"
                className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <User className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </motion.div>

          {/* Horizontal Navigation Bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 bg-slate-900/50 backdrop-blur-md border-b border-slate-700/30"
          >
            <div className="px-8 py-4">
              <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
                {[
                  { name: "Dashboard", href: "/", icon: LayoutDashboard },
                  { name: "Scan Agent", href: "/agents/scan", icon: QrCode },
                  { name: "Identity Agent", href: "/agents/identity", icon: Fingerprint },
                  { name: "Provenance Agent", href: "/agents/provenance", icon: Navigation },
                  { name: "Anomaly Agent", href: "/agents/anomaly", icon: Activity },
                  { name: "Courier Agent", href: "/agents/courier", icon: UserCheck },
                  { name: "Risk Agent", href: "/agents/risk", icon: AlertTriangle },
                  { name: "Council Agent", href: "/agents/council", icon: Scale },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05, type: "spring" }}
                      whileHover={{ y: -2, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={item.href}
                        className="group flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 hover:bg-slate-800/50 border border-transparent hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/20"
                      >
                        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                          <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors text-center leading-tight">
                          {item.name}
                        </span>
                        <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Content - Central Pipeline & Right Metrics */}
          <div className="relative z-10 flex gap-8 p-6 min-h-[calc(100vh-120px)]">
            {/* Central Verification Pipeline */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex-1 max-w-4xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent neon-text">
                  VERIFICATION PIPELINE
                </h2>
                <p className="text-slate-400 text-sm">Multi-Agent Counterfeit Detection System</p>
              </div>

              <Card className="bg-slate-800/30 backdrop-blur-md border-slate-700 overflow-hidden relative neon-glow">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    Comprehensive Audit Terminal
                  </CardTitle>
                  <p className="text-slate-400">Initiate multi-agent counterfeit detection analysis</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Scan Input */}
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <ScanInputCard onSubmit={handleScan} loading={loading} />
                  </div>

                  {/* Results Display */}
                  <AnimatePresence>
                    {(error || result) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-slate-900/50 rounded-xl p-6 border border-slate-700"
                      >
                        {error && (
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-red-400 mb-2">Audit Error</h3>
                              <p className="text-red-300">{error}</p>
                            </div>
                          </div>
                        )}

                        {result && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold text-white">Audit Results</h3>
                              {getVerdictIcon()}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                  <span className="text-slate-400">Verdict</span>
                                  <Badge className={`text-lg px-4 py-2 ${
                                    result.verdict.verdict === "AUTHENTIC" ? "bg-green-600" :
                                    result.verdict.verdict === "COUNTERFEIT" ? "bg-red-600" :
                                    "bg-yellow-600"
                                  }`}>
                                    {result.verdict.verdict}
                                  </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                  <span className="text-slate-400">Confidence</span>
                                  <span className="text-2xl font-bold text-white">{result.verdict.confidence}%</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                  <span className="text-slate-400">Part ID</span>
                                  <span className="text-white font-mono">{result.part_id}</span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="p-4 bg-slate-800/50 rounded-lg">
                                  <h4 className="font-semibold text-white mb-2">Reasoning</h4>
                                  <p className="text-sm text-slate-300">{result.verdict.reasoning}</p>
                                </div>

                                {result.verdict.critical_findings.length > 0 && (
                                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <h4 className="font-semibold text-red-400 mb-2">Critical Findings</h4>
                                    <ul className="text-sm text-red-300 space-y-1">
                                      {result.verdict.critical_findings.map((finding, index) => (
                                        <li key={index}>• {finding}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!result && !error && !loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-slate-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Ready for Analysis</h3>
                      <p className="text-slate-400">Enter scan details above to begin multi-agent audit</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right-Side Security Health Metrics */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-96 space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white neon-text">Security Health</h3>
                <p className="text-slate-400 text-sm">Agent Status Monitor</p>
              </div>

              {mockAgents.map((agent, index) => (
                <motion.div
                  key={agent.agent_name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700 hover:border-slate-600 transition-all duration-300 overflow-hidden relative">
                    {/* Animated Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${agent.agent_name.includes("Scan") ? "bg-blue-500/20 text-blue-400" :
                          agent.agent_name.includes("Identity") ? "bg-purple-500/20 text-purple-400" :
                          agent.agent_name.includes("Provenance") ? "bg-green-500/20 text-green-400" :
                          agent.agent_name.includes("Anomaly") ? "bg-red-500/20 text-red-400" :
                          agent.agent_name.includes("Courier") ? "bg-orange-500/20 text-orange-400" :
                          agent.agent_name.includes("Risk") ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-cyan-500/20 text-cyan-400"} transition-colors duration-300`}>
                          {agent.agent_name.includes("Scan") ? <Fingerprint className="w-5 h-5" /> :
                           agent.agent_name.includes("Identity") ? <Shield className="w-5 h-5" /> :
                           agent.agent_name.includes("Provenance") ? <Navigation className="w-5 h-5" /> :
                           agent.agent_name.includes("Anomaly") ? <Activity className="w-5 h-5" /> :
                           agent.agent_name.includes("Courier") ? <UserCheck className="w-5 h-5" /> :
                           agent.agent_name.includes("Risk") ? <AlertTriangle className="w-5 h-5" /> :
                           <Scale className="w-5 h-5" />}
                        </div>

                        <Badge className={`${agent.passed ? "bg-green-500/20 text-green-400 border-green-500/30" :
                          "bg-red-500/20 text-red-400 border-red-500/30"} border text-xs`}>
                          {agent.status_label}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                          {agent.agent_name}
                        </h4>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Confidence</span>
                            <span className="text-sm font-bold text-white">{agent.confidence}%</span>
                          </div>

                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all duration-1000 ${
                              agent.confidence >= 90 ? "bg-green-500" :
                              agent.confidence >= 70 ? "bg-blue-500" :
                              agent.confidence >= 40 ? "bg-yellow-500" : "bg-red-500"
                            }`} style={{ width: `${agent.confidence}%` }} />
                          </div>

                          {!agent.passed && agent.details.error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mt-2">
                              <p className="text-xs text-red-400">{agent.details.error}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Activity, Zap, TrendingUp, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

// Animation Variants for staggered entrance
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 } as any
  }
}

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } as any }
}

export default function AnomalyAgentPage() {
  // ... (Keep your existing data arrays: velocityData, scanIntervalData, detectedAnomalies)
  const velocityData = [
    { time: "08:00", velocity: 45, threshold: 800 },
    { time: "10:00", velocity: 120, threshold: 800 },
    { time: "12:00", velocity: 280, threshold: 800 },
    { time: "14:00", velocity: 95, threshold: 800 },
    { time: "16:00", velocity: 850, threshold: 800 },
  ]

  const scanIntervalData = [
    { interval: "0-30min", count: 145, normal: 150 },
    { interval: "30-60min", count: 89, normal: 85 },
    { interval: "1-2hrs", count: 52, normal: 50 },
    { interval: "2-4hrs", count: 28, normal: 30 },
    { interval: "4+hrs", count: 12, normal: 10 },
  ]

  const detectedAnomalies = [
    { type: "IMPOSSIBLE_TRAVEL", part: "PART_CLONE_456", details: "Travel speed 1,245 km/h exceeds maximum 800 km/h", severity: "HIGH", time: "14:32" },
    { type: "CLONE_ATTACK", part: "PART_SERVO_789", details: "Part detected in Tokyo and Berlin simultaneously", severity: "CRITICAL", time: "13:15" },
    { type: "TIME_ANOMALY", part: "PART_BATTERY_321", details: "Scans only 8 minutes apart (minimum: 30 minutes)", severity: "MEDIUM", time: "11:48" },
  ]

  const anomalyContainerClass = (severity: string) => {
    if (severity === "CRITICAL") return "bg-red-50/50 border-red-200 backdrop-blur-sm shadow-sm"
    if (severity === "HIGH") return "bg-orange-50/50 border-orange-200 backdrop-blur-sm shadow-sm"
    return "bg-yellow-50/50 border-yellow-200 backdrop-blur-sm shadow-sm"
  }

  const anomalyIconClass = (severity: string) => {
    if (severity === "CRITICAL") return "text-red-600"
    if (severity === "HIGH") return "text-orange-600"
    return "text-yellow-600"
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
      </div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 flex justify-between items-center p-8 border-b border-slate-700/50"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Activity className="w-10 h-10 text-red-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              ANOMALY AGENT
            </h1>
            <p className="text-slate-400 text-sm">The Pattern Hunter • Statistical Anomaly Detection Engine</p>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex items-center gap-4"
        >
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-sm font-bold text-orange-400">PATTERN ANALYSIS</span>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">CLONE DETECTION</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 p-8 space-y-8">

      {/* Stats Overview with Pop Effect */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Activity, val: "4,521", lab: "Scans Analyzed", col: "text-blue-600" },
          { icon: AlertTriangle, val: "17", lab: "Anomalies Detected", col: "text-orange-600" },
          { icon: Zap, val: "3", lab: "Clone Attacks", col: "text-purple-600" },
          { icon: TrendingUp, val: "99.6%", lab: "Normal Rate", col: "text-green-600" }
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-8 h-8 ${stat.col}`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.val}</p>
                    <p className="text-xs text-muted-foreground">{stat.lab}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts with Slide-in Effect */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
            <CardHeader><CardTitle>Velocity Analysis (km/h)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" /> <YAxis /> <Tooltip /> <Legend />
                  <Line type="monotone" dataKey="velocity" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
            <CardHeader><CardTitle>Scan Interval Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scanIntervalData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="interval" /> <YAxis /> <Tooltip /> <Legend />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual" />
                  <Bar dataKey="normal" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Expected" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Anomalies with Staggered Slide */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-xl">
          <CardHeader><CardTitle>Recent Anomalies Detected</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {detectedAnomalies.map((anomaly, index) => (
              <motion.div 
                key={index} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ x: 5 }}
                className={`p-4 rounded-xl border-2 transition-all ${anomalyContainerClass(anomaly.severity)} hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-6 h-6 ${anomalyIconClass(anomaly.severity)}`} />
                    <div>
                      <p className="font-bold text-sm tracking-tight">{anomaly.type}</p>
                      <p className="text-xs font-mono text-muted-foreground bg-white/50 px-1 rounded inline-block">{anomaly.part}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="font-bold" variant="destructive">{anomaly.severity}</Badge>
                    <p className="text-xs text-muted-foreground mt-1 opacity-70">{anomaly.time}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{anomaly.details}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </motion.div>
  )
}

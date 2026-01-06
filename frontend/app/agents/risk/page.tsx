"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingDown, TrendingUp, Shield, Activity, Target, Zap } from "lucide-react"
import { motion } from "framer-motion"

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } as any }
}

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } as any }
}

export default function RiskAgentPage() {
  const riskScore = {
    overall: 87.5,
    level: "LOW",
    components: {
      identity: { score: 95, weight: 0.25, contribution: 23.75 },
      provenance: { score: 100, weight: 0.30, contribution: 30.0 },
      anomaly: { score: 80, weight: 0.25, contribution: 20.0 },
      courier: { score: 95, weight: 0.20, contribution: 19.0 },
    }
  }

  const riskHistory = [
    { partId: "PART_SERVO_12345", score: 92.5, level: "LOW", time: "14:15" },
    { partId: "PART_BATTERY_67890", score: 88.0, level: "LOW", time: "13:42" },
    { partId: "PART_SENSOR_11111", score: 45.5, level: "HIGH", time: "12:30" },
    { partId: "PART_SUSPICIOUS_999", score: 15.0, level: "CRITICAL", time: "11:05" },
  ]

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "text-emerald-600 bg-emerald-50 border-emerald-200 shadow-emerald-100"
      case "MEDIUM": return "text-amber-600 bg-amber-50 border-amber-200 shadow-amber-100"
      case "HIGH": return "text-orange-600 bg-orange-50 border-orange-200 shadow-orange-100"
      case "CRITICAL": return "text-red-600 bg-red-50 border-red-200 shadow-red-100"
      default: return "text-slate-600 bg-slate-50 border-slate-200 shadow-slate-100"
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Risk Agent
          </h1>
          <p className="text-muted-foreground italic">
            Dynamic Risk Scorecard - Aggregates multi-agent weighted results
          </p>
        </div>
      </motion.div>

      {/* Current Risk Assessment - Focused Hero Card */}
      <motion.div variants={itemVariants}>
        <Card className={`border-2 transition-all duration-500 overflow-hidden relative ${getRiskColor(riskScore.level)}`}>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield className="w-64 h-64" />
          </div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest opacity-70">Live Security Posture</CardTitle>
              <Badge className={`text-lg px-6 py-1 rounded-full border-none font-black ${
                 riskScore.level === 'LOW' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {riskScore.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="text-center lg:border-r border-current/10">
                <motion.p 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="text-8xl font-black tracking-tighter"
                >
                  {riskScore.overall}
                </motion.p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Confidence Rating</p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(riskScore.components).map(([name, data]) => (
                  <div key={name} className="p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700">{name}</span>
                      <span className="text-[10px] font-bold text-slate-400">Weight: {data.weight * 100}%</span>
                    </div>
                    <div className="space-y-3">
                      <Progress value={data.score} className="h-1.5" />
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Score: {data.score}%</span>
                        <span className="text-blue-600">+{data.contribution.toFixed(2)} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Threshold Matrix */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/40 backdrop-blur-xl border-slate-200 shadow-xl h-full">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Threshold Protocols</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { l: "LOW", s: "75-100", a: "Standard Processing", c: "emerald", i: Shield },
                { l: "MEDIUM", s: "50-75", a: "Secondary Audit", c: "amber", i: Activity },
                { l: "HIGH", s: "25-50", a: "Immediate Quarantine", c: "orange", i: TrendingDown },
                { l: "CRITICAL", s: "0-25", a: "Security Rejection", c: "red", i: AlertTriangle }
              ].map((row) => (
                <div key={row.l} className={`flex items-center gap-4 p-3 rounded-xl border border-${row.c}-100 bg-${row.c}-50/30 group transition-all hover:translate-x-1`}>
                   <div className={`p-2 rounded-lg bg-${row.c}-500 text-white shadow-lg shadow-${row.c}-200`}>
                      <row.i className="w-4 h-4" />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-[10px] font-black text-${row.c}-700`}>{row.l} RISK</span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">{row.s}</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600">{row.a}</p>
                   </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Scoring Logic Terminal */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900 border-none shadow-2xl h-full flex flex-col">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                 <Target className="w-3 h-3" /> Weighted Algorithm V2.4
               </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed mb-6">
                <p className="text-blue-300">SCORE = Σ(Agent_n * Weight_n)</p>
                <div className="text-slate-500 mt-2 space-y-1">
                   <p>&gt; ID (25%) + PROV (30%)</p>
                   <p>&gt; ANOM (25%) + COUR (20%)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1 text-red-400">
                    <Zap className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase">Failure Penalty</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">-30pts on Critical Flag</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1 text-purple-400">
                    <Activity className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase">Impact Factor</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">Zero-weight on Agent Fail</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Risk History Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 shadow-xl overflow-hidden bg-white/40 backdrop-blur-md">
           <CardHeader className="bg-white/60 border-b">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Audit Trail: Recent Assessments</CardTitle>
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                 {riskHistory.map((item, index) => (
                   <div key={index} className="flex items-center justify-between p-4 group hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${
                            item.level === 'LOW' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                         }`}>
                            {item.level === "LOW" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                         </div>
                         <div>
                            <p className="text-sm font-bold font-mono text-slate-700 tracking-tighter">{item.partId}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Score: {item.score}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <Badge className={`text-[10px] font-black uppercase border-none px-3 ${
                            item.level === 'LOW' ? 'bg-emerald-500' : 'bg-red-500'
                         }`}>
                            {item.level}
                         </Badge>
                         <span className="text-[10px] font-mono font-bold text-slate-300">{item.time}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
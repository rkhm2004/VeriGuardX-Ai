"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapVisualizer } from "@/components/map-visualizer"
import { MapPin, Lock, Unlock, CheckCircle2, AlertTriangle, ArrowRight, Activity, Navigation } from "lucide-react"
import { motion } from "framer-motion"

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } as any }
}

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } as any }
}

export default function ProvenanceAgentPage() {
  const route = ["FACTORY_SIEMENS_DE", "HUB_BERLIN", "HUB_MUNICH", "WAREHOUSE_DE"]
  const currentStage = "HUB_BERLIN"
  
  const checkpoints = [
    { location: "FACTORY_SIEMENS_DE", status: "completed", timestamp: "2024-01-04 08:30:00", locked: true },
    { location: "HUB_BERLIN", status: "current", timestamp: "2024-01-04 14:15:00", locked: false },
    { location: "HUB_MUNICH", status: "pending", timestamp: null, locked: false },
    { location: "WAREHOUSE_DE", status: "pending", timestamp: null, locked: false },
  ]

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
            <Navigation className="w-8 h-8 text-blue-600" />
            Provenance Agent
          </h1>
          <p className="text-muted-foreground italic">
            The Navigator - Enforces rolling checkpoint logic and location lock-out
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Tracking Active
        </Badge>
      </motion.div>

      {/* Map Visualization with Glow Effect */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <Card className="relative bg-white/40 backdrop-blur-md border-slate-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-white/60 border-b">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Live Route Visualization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full bg-slate-50 flex items-center justify-center">
               <MapVisualizer route={route} currentStage={currentStage} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rolling Checkpoint Status */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Chain of Custody</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {checkpoints.map((checkpoint, index) => (
              <motion.div
                key={checkpoint.location}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                className={`relative p-4 rounded-xl border transition-all duration-300 ${
                  checkpoint.status === "completed" ? "bg-emerald-50/50 border-emerald-100" :
                  checkpoint.status === "current" ? "bg-blue-50/50 border-blue-200 shadow-sm ring-1 ring-blue-100" :
                  "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                      checkpoint.status === "completed" ? "bg-emerald-500 text-white" :
                      checkpoint.status === "current" ? "bg-blue-500 text-white animate-pulse" :
                      "bg-slate-200 text-slate-400"
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${checkpoint.status === "current" ? "text-blue-700" : "text-slate-700"}`}>
                        {checkpoint.location}
                      </p>
                      {checkpoint.timestamp && (
                        <p className="text-[10px] font-mono text-slate-400">{checkpoint.timestamp}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                       {checkpoint.locked ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          <Lock className="w-3 h-3" /> Locked
                        </div>
                      ) : (
                        <Unlock className="w-3 h-3 text-slate-300" />
                      )}
                      <Badge className={`text-[10px] uppercase font-black ${
                        checkpoint.status === "completed" ? "bg-emerald-500" :
                        checkpoint.status === "current" ? "bg-blue-600" : "bg-slate-300"
                      }`}>
                        {checkpoint.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Rolling Lock Logic & Status Summary */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-tighter text-slate-400">Lock-Out Logic</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: CheckCircle2, title: "Sequential Validation", desc: "Exact order arrival enforced", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Lock, title: "Previous Lock-Out", desc: "Backward movement disabled", color: "text-purple-600", bg: "bg-purple-50" },
                { icon: AlertTriangle, title: "Violation Alerts", desc: "Skipped node detection", color: "text-orange-600", bg: "bg-orange-50" }
              ].map((logic, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 ${logic.bg} rounded-xl border border-white shadow-sm`}>
                  <logic.icon className={`w-5 h-5 ${logic.color} mt-0.5`} />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{logic.title}</h4>
                    <p className="text-[10px] text-slate-500">{logic.desc}</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Stage</p>
                      <p className="text-sm font-bold text-slate-700">2 of 4</p>
                   </div>
                   <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Next Node</p>
                      <p className="text-sm font-bold text-blue-600">HUB_MUNICH</p>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sequences Violations List */}
          <Card className="border-red-100 bg-red-50/30 overflow-hidden">
            <div className="p-3 bg-red-500 text-white flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Security Exceptions</span>
            </div>
            <CardContent className="p-3 space-y-2">
               {[{ id: "SUSP_999", type: "SKIP", msg: "Expected BER, got WHS", t: "15m ago" }, { id: "STOLEN_123", type: "REV", msg: "Backwards to FACTORY", t: "1h ago" }].map((v, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-red-100 shadow-sm group hover:bg-red-50 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-black text-[10px]">
                          {v.type}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-800 font-mono">{v.id}</p>
                          <p className="text-[10px] text-red-500">{v.msg}</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{v.t}</span>
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
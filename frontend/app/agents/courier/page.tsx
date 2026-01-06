"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CourierBadge } from "@/components/courier-badge"
import { User, Clock, MapPin, Shield, CheckCircle2, XCircle, Users } from "lucide-react"
import { motion } from "framer-motion"

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } as any }
}

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } as any }
}

export default function CourierAgentPage() {
  const currentCourier = {
    agent_name: "Courier Agent",
    passed: true,
    confidence: 95,
    courier_name: "John Doe",
    shift_valid: true,
    region_authorized: true,
    clearance_level: "LEVEL_2",
    details: {
      courier_id: "COR_JOHN_DOE_001",
      full_name: "John Doe",
      status: "ACTIVE",
      clearance: "LEVEL_2",
      authorized_regions: ["HUB_BERLIN", "HUB_MUNICH", "WAREHOUSE_DE"],
      shift_schedule: {
        monday: "08:00-16:00",
        tuesday: "08:00-16:00",
        wednesday: "08:00-16:00",
        thursday: "08:00-16:00",
        friday: "08:00-16:00"
      },
      checks_performed: ["region_authorization", "shift_validation", "security_clearance"]
    },
    timestamp: new Date().toISOString()
  }

  const allCouriers = [
    { id: "COR_JOHN_DOE_001", name: "John Doe", status: "ON_DUTY", clearance: "LEVEL_2", region: "Germany", scans_today: 23 },
    { id: "COR_JANE_SMITH_001", name: "Jane Smith", status: "ON_DUTY", clearance: "LEVEL_3", region: "Japan", scans_today: 18 },
    { id: "COR_MIKE_CHEN_001", name: "Mike Chen", status: "OFF_DUTY", clearance: "LEVEL_2", region: "USA East", scans_today: 0 },
    { id: "COR_SARAH_LEE_001", name: "Sarah Lee", status: "ON_DUTY", clearance: "LEVEL_3", region: "Singapore", scans_today: 31 },
  ]

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">👤 Courier Agent</h1>
        <p className="text-muted-foreground italic">
          The Human Verifier - Validates personnel authorization and shift compliance
        </p>
      </motion.div>

      {/* Current Courier - High Profile View */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Current Scan Authorization</h2>
          <CourierBadge courier={currentCourier as any} />
        </div>
      </motion.div>

      {/* Verification Checks Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: MapPin, label: "Region Auth", color: "bg-emerald-50 text-emerald-600", val: "HUB_BERLIN", sub: "Authorized" },
          { icon: Clock, label: "Shift Timing", color: "bg-blue-50 text-blue-600", val: "14:32", sub: "08:00-16:00" },
          { icon: Shield, label: "Security Level", color: "bg-purple-50 text-purple-600", val: "LEVEL_2", sub: "Verified" }
        ].map((check, idx) => (
          <Card key={idx} className="bg-white/50 backdrop-blur-md border-slate-200 overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className={`p-3 rounded-xl ${check.color} transition-transform group-hover:scale-110`}>
                  <check.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{check.label}</p>
                  <p className="text-sm font-bold text-slate-700 font-mono">{check.val}</p>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500">{check.sub}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Registry Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 shadow-xl overflow-hidden bg-white/40 backdrop-blur-xl">
          <CardHeader className="bg-white/60 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Active Courier Registry
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">{allCouriers.length} Operators</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {allCouriers.map((courier) => (
                <motion.div
                  key={courier.id}
                  whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                  className="flex items-center justify-between p-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        courier.status === "ON_DUTY" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"
                      }`}>
                        <User className={`w-5 h-5 ${courier.status === "ON_DUTY" ? "text-emerald-600" : "text-slate-400"}`} />
                      </div>
                      {courier.status === "ON_DUTY" && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{courier.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{courier.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden md:block text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-300">Region</p>
                      <p className="text-xs font-medium">{courier.region}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-300">Activity</p>
                      <p className="text-xs font-bold text-blue-600">{courier.scans_today} Scans</p>
                    </div>
                    <Badge className={courier.status === "ON_DUTY" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-200 text-slate-600 hover:bg-slate-300 border-none"}>
                      {courier.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Violations and Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-slate-200 h-full">
            <CardHeader><CardTitle className="text-sm font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/>Shift Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                  const isWeekend = i > 4;
                  return (
                    <div key={day} className={`p-2 rounded-lg text-center border ${isWeekend ? "bg-slate-50 border-slate-100" : "bg-emerald-50 border-emerald-100"}`}>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{day}</p>
                      <p className={`text-[8px] font-bold ${isWeekend ? "text-slate-400" : "text-emerald-700"}`}>{isWeekend ? "OFF" : "08-16"}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-red-100 bg-red-50/30">
            <CardHeader><CardTitle className="text-sm font-bold text-red-600 flex items-center gap-2"><XCircle className="w-4 h-4"/>Auth Violations</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[{ id: "COR_UNKN_999", msg: "ID not in registry", t: "1h ago" }, { id: "COR_MIKE_001", msg: "Out-of-shift scan", t: "3h ago" }].map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/60 border border-red-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-700 font-mono">{v.id}</p>
                      <p className="text-[10px] text-red-500">{v.msg}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{v.t}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
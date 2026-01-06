"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Camera, FileText, CheckCircle2, XCircle, Scan, History, Zap, Activity, MapPin, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { Html5QrcodeScanner } from "html5-qrcode"

export default function ScanAgentPage() {
  const [scanMode, setScanMode] = useState<"qr" | "manual">("qr")
  const [scanning, setScanning] = useState(false)

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => setScanning(false), 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-1 relative min-h-screen"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 matrix-bg opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex justify-between items-start mb-8"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent neon-text">
            <motion.div
              animate={{ rotate: scanning ? 360 : 0 }}
              transition={{ duration: scanning ? 1 : 0, repeat: scanning ? Infinity : 0, ease: "linear" }}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"
            >
              <Scan className="w-8 h-8 text-blue-400" />
            </motion.div>
            SCAN AGENT
          </h1>
          <p className="text-slate-400 italic text-lg mt-2">
            The Gatekeeper - Directs parts toward digital or visual audit pathways
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-bold animate-pulse border border-blue-400/30 shadow-lg shadow-blue-500/20">
            <Activity className="w-4 h-4 mr-2" />
            SYSTEM ONLINE
          </Badge>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Scanner with Laser Effect */}
        <Card className="border-slate-200 shadow-xl overflow-hidden bg-white/40 backdrop-blur-md">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Live Input Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={scanMode} onValueChange={(v) => setScanMode(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="qr" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <QrCode className="w-4 h-4 mr-2" /> QR Scan
                </TabsTrigger>
                <TabsTrigger value="manual" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <FileText className="w-4 h-4 mr-2" /> Manual Audit
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="qr" key="qr-mode">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative bg-slate-900 rounded-2xl aspect-square flex items-center justify-center overflow-hidden border-4 border-slate-800 shadow-inner">
                      {scanning ? (
                        <>
                          {/* Laser Line Animation */}
                          <motion.div 
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] z-20"
                          />
                          <div className="text-center z-10">
                            <Camera className="w-16 h-16 mx-auto text-blue-400 animate-pulse" />
                            <p className="mt-4 text-xs font-mono text-blue-400 uppercase tracking-widest">Decoding Stream...</p>
                          </div>
                          {/* Glitch Overlay */}
                          <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay animate-pulse" />
                        </>
                      ) : (
                        <div className="text-center group">
                          <QrCode className="w-20 h-20 mx-auto text-slate-700 group-hover:text-blue-500 transition-colors duration-500" />
                          <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">Ready for capture</p>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleScan} 
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95" 
                      disabled={scanning}
                    >
                      {scanning ? "Processing..." : "Initiate QR Capture"}
                    </Button>
                  </motion.div>
                </TabsContent>

                <TabsContent value="manual" key="manual-mode">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-50 rounded-2xl aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                      <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center px-8">
                        Visual Description Mode<br/>
                        <span className="font-normal normal-case">For items without legible tags</span>
                      </p>
                    </div>
                    <Button className="w-full h-12" variant="outline">
                      Manually Input Part Features
                    </Button>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>

        {/* Decision Logic & Stats */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-lg bg-gradient-to-br from-white to-slate-50">
            <CardHeader><CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Decision Engine</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="group p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Path A: Digital Audit</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Verification via <span className="text-emerald-600 font-bold">Identity</span> → Provenance → Anomaly agents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-4 bg-amber-50/50 rounded-2xl border border-amber-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500 rounded-lg text-white">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Path B: Visual Audit</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      LLM-based analysis of <span className="text-amber-600 font-bold">Visual Description</span> + Courier verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-3xl font-black text-blue-600 tracking-tighter">156</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Digital Path</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                  <p className="text-3xl font-black text-amber-600 tracking-tighter">23</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Visual Path</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Scans Audit Trail */}
      <Card className="border-slate-200 shadow-xl overflow-hidden bg-white/40 backdrop-blur-md">
        <CardHeader className="bg-white/60 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <History className="w-4 h-4" /> Recent Activity Log
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">Auto-Refreshing</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {[
              { id: "PART_SERVO_12345", time: "2 min ago", path: "A", status: "success" },
              { id: "PART_BATTERY_67890", time: "5 min ago", path: "A", status: "success" },
              { id: "PART_UNKNOWN_999", time: "12 min ago", path: "B", status: "failed" },
            ].map((scan, i) => (
              <motion.div 
                key={scan.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 group hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                    scan.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {scan.path}
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-slate-700">{scan.id}</span>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Routing: Path {scan.path === 'A' ? 'Digital' : 'Visual'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <History className="w-3 h-3" /> {scan.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

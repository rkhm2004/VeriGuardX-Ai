"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Key, CheckCircle2, XCircle, Shield, Lock, Cpu, Fingerprint } from "lucide-react"
import { motion, Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
}

type VerificationStep = {
  name: string
  status: string
  time: string
  desc: string
}

type OemKey = {
  id: string
  name: string
  status: string
  parts: number
}

export default function IdentityAgentPage() {
  const verificationSteps: VerificationStep[] = [
    { name: "Ledger Lookup", status: "passed", time: "12ms", desc: "Verifying serial existence in global registry" },
    { name: "Serial Hash Verification", status: "passed", time: "8ms", desc: "Matching SHA-256 local hash with ledger" },
    { name: "OEM Key Retrieval", status: "passed", time: "15ms", desc: "Fetching public key from authorized provider" },
    { name: "Cryptographic Signature", status: "passed", time: "45ms", desc: "RSA-PSS signature validation" },
  ]

  const oemKeys: OemKey[] = [
    { id: "OEM_SIEMENS_001", name: "Siemens Industrial", status: "active", parts: 1247 },
    { id: "OEM_BOSCH_001", name: "Bosch Manufacturing", status: "active", parts: 2891 },
    { id: "OEM_TESLA_001", name: "Tesla Motors", status: "active", parts: 456 },
  ]

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
            <Fingerprint className="w-10 h-10 text-blue-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              IDENTITY AGENT
            </h1>
            <p className="text-slate-400 text-sm">The Crypto Detective • RSA-PSS Validation Engine</p>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex items-center gap-4"
        >
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-sm font-bold text-green-400">ENCLAVE SECURE</span>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-blue-400">FIPS 140-2</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Verification Pipeline */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" /> Hardware-Level Verification Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {verificationSteps.map((step, index) => (
                    <motion.div
                      key={step.name}
                      variants={itemVariants}
                      className="relative flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === "passed" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        {step.status === "passed" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-sm text-white">{step.name}</p>
                          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">{step.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Verification Stats */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-xs font-black uppercase tracking-widest">Security Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-300">Trust Score</span>
                    <span className="font-black text-green-400 text-lg">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-3 bg-slate-700" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-300">Latent Delay</span>
                    <span className="font-bold text-cyan-400">32ms</span>
                  </div>
                  <Progress value={35} className="h-3 bg-slate-700" />
                </div>

                <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-green-400">Verified</p>
                    <p className="text-xl font-black text-white tracking-tighter">4,594</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-red-400">Failed</p>
                    <p className="text-xl font-black text-red-400 tracking-tighter">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Shield className="w-16 h-16 text-blue-400" />
               </div>
               <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Key className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Encryption Logic</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 space-y-1">
                    <p className="text-cyan-400">ALGO: RSA-PSS-2048</p>
                    <p className="text-purple-400">HASH: SHA-256</p>
                    <p className="text-slate-500 leading-tight">MGF: MGF1 w/ SHA-256</p>
                    <p className="text-slate-500 leading-tight">SALT: 32-Octets</p>
                  </div>
               </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* OEM Registry */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
            <CardHeader className="border-b border-slate-700 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" /> Authorized Key Registry
              </CardTitle>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">3 Active Providers</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700">
                {oemKeys.map((oem) => (
                  <div
                    key={oem.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center border border-slate-600 group-hover:scale-110 transition-transform">
                        <Shield className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{oem.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{oem.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Traffic</p>
                        <p className="text-xs font-bold text-cyan-400">{oem.parts} Units</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-black uppercase">
                        {oem.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hex Sample Block */}
        <motion.div variants={itemVariants} className="bg-slate-900/80 rounded-2xl border border-slate-700 shadow-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
             <Cpu className="w-3 h-3 text-cyan-400" /> Live Enclave Serial Hash
          </h4>
          <p className="font-mono text-xs text-blue-400/80 break-all leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-600">
            a3f5b9c2e1d8f6a4b7c9e3d5f8a1b4c7e2d6f9a3b5c8e1d4f7a2b6c9e3d5f8a1
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

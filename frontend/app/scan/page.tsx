"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { scanPart } from "@/lib/api"
import { ScanResult } from "@/lib/types"
import { QrCode, Shield, CheckCircle, XCircle, Loader2, AlertTriangle, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVerification } from "@/lib/contexts/VerificationContext"

export default function ScanAgent() {
  const [courierId, setCourierId] = useState("")
  const [partId, setPartId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [terminalStatus, setTerminalStatus] = useState("SYSTEM_READY // Awaiting Input")
  const [toastMessage, setToastMessage] = useState("")
  const router = useRouter()
  const { updateAgentProgress, setCurrentStep, setProductId } = useVerification()

  // Define keyframes for diagonal scan animation (Cyberpunk Scanline)
  const diagonalScanKeyframes = `
    @keyframes diagonalScan {
      from { background-position: 0 0; }
      to { background-position: 20px 20px; }
    }
  `

  const handleScan = async () => {
    if (!courierId || !partId) return

    setLoading(true)
    setResult(null)
    setTerminalStatus('INITIATING_SCAN_PROTOCOL...')
    setToastMessage('')

    // Artificial delay for "Scanning" effect
    setTimeout(async () => {
      try {
        setTerminalStatus('ANALYZING_BIOMETRICS_AND_LEDGER...')
        const scanResult = await scanPart(courierId, partId)

        // --- 1. HANDLE SMART RETRY (Feedback Loop) ---
        if (scanResult.action_required === "RESCAN_SUGGESTED") {
          setTerminalStatus('SIGNAL_INTERFERENCE_DETECTED')
          setToastMessage('Low Confidence Signal. Re-calibrating Sensors... Retrying')

          setTimeout(() => {
            handleScan()
          }, 2000)
          return
        }

        setResult(scanResult)
        setProductId(partId)

        // --- 2. HANDLE RESULTS & REDIRECTS ---
        if (scanResult.success) {
            setTerminalStatus('VERIFICATION_COMPLETE // ACCESS_GRANTED')
            updateAgentProgress('scan', 100)
            setCurrentStep('identity')

            // Success Redirect to Identity Agent
            setTimeout(() => router.push('/identity'), 1500)
        } else {
            // FAILURE CASE: Auto-redirect to Visual Council immediately
            setTerminalStatus('VERIFICATION_FAILED // THREAT_DETECTED')
            updateAgentProgress('scan', 0) // Reset or mark as failed
            setCurrentStep('visual')

            setToastMessage(`Security Alert! Redirecting to Visual Council...`)
            // Force redirect without user intervention
            setTimeout(() => {
                window.location.href = '/visual'
            }, 2000)
        }

      } catch (error) {
        console.error('Scan failed:', error);
        setTerminalStatus('[SYSTEM_WARNING]: CONNECTION_INTERRUPTED')

        setResult({
          success: false,
          message: error instanceof Error ? error.message : "Council Server Unreachable. Check connection.",
          redirect: null
        })
      } finally {
        if (toastMessage !== 'Low Confidence Signal. Re-calibrating Sensors... Retrying') {
             setLoading(false)
        }
      }
    }, 1500)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: diagonalScanKeyframes }} />
      <div className="min-h-screen w-full bg-[linear-gradient(to_right,#06b6d412_1px,transparent_1px),linear-gradient(to_bottom,#06b6d412_1px,transparent_1px)] bg-[size:24px_24px] text-gray-300 font-mono">
      <div className="w-full max-w-[95%] mx-auto border border-cyan-500/30 bg-black/90 backdrop-blur-sm min-h-screen flex flex-col">
        
        {/* Header Section */}
        <div className="w-full border-b border-cyan-500/30 bg-black/50 p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 font-mono tracking-wider mb-2 flex items-center gap-4">
             SCAN_AGENT // INTAKE_VALIDATOR
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-cyan-500/50 pl-4">
            Validates courier credentials and intake manifests against the immutable ledger.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 h-full">
          
          {/* Left Panel - VERIFICATION_TERMINAL */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-cyan-500/30">
            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 h-full shadow-[0_0_20px_rgba(6,182,212,0.05)]">
              <h2 className="text-cyan-400 text-sm font-mono uppercase tracking-widest mb-6 border-b border-cyan-500/30 pb-2 flex justify-between">
                <span>[ VERIFICATION_TERMINAL ]</span>
                <span className="animate-pulse">● ONLINE</span>
              </h2>
              
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-cyan-400 text-xs font-mono tracking-widest mb-2">
                    COURIER_BADGE_ID
                  </label>
                  <input
                    type="text"
                    value={courierId}
                    onChange={(e) => setCourierId(e.target.value)}
                    className="w-full bg-black/50 border border-cyan-500/30 text-cyan-300 placeholder-cyan-900/50 px-4 py-3 font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all"
                    placeholder="ENTER BADGE ID (e.g. TRUSTED-001)"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-cyan-400 text-xs font-mono tracking-widest mb-2">
                    PART_SERIAL_NUMBER
                  </label>
                  <input
                    type="text"
                    value={partId}
                    onChange={(e) => setPartId(e.target.value)}
                    className="w-full bg-black/50 border border-cyan-500/30 text-cyan-300 placeholder-cyan-900/50 px-4 py-3 font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all"
                    placeholder="SCAN PART ID (e.g. B08N5KWB9H)"
                    disabled={loading}
                  />
                </div>

                <button
                  onClick={handleScan}
                  disabled={loading || !courierId || !partId}
                  className={`w-full relative overflow-hidden group border border-cyan-500/50 text-cyan-400 py-4 font-mono font-bold tracking-wider transition-all duration-300 ${
                    loading ? 'cursor-not-allowed opacity-80' : 'hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}
                >
                    <div className="absolute inset-0 w-0 bg-cyan-400/10 transition-all duration-[250ms] ease-out group-hover:w-full opacity-0 group-hover:opacity-100"></div>
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{terminalStatus === 'SIGNAL_INTERFERENCE_DETECTED' ? 'RE-CALIBRATING...' : 'PROCESSING...'}</span>
                    </div>
                  ) : (
                    "INITIATE_SCAN_SEQUENCE"
                  )}
                </button>

                {/* Result Card */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 border rounded-lg mt-6 overflow-hidden ${
                        result.success
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-red-500/50 bg-red-500/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.success ? (
                          <CheckCircle className="w-6 h-6 text-green-400 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5" />
                        )}
                        <div>
                            <span className={`font-mono font-bold block mb-1 ${
                                result.success ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {result.success ? 'SCAN_SUCCESSFUL' : 'SCAN_FAILED'}
                            </span>
                            <p className="text-sm font-mono text-gray-300 leading-tight">{result.message}</p>
                            
                            {/* Visual Indicator of Redirect */}
                            {!result.success && result.redirect && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-red-400 animate-pulse">
                                    <ArrowRight className="w-4 h-4" />
                                    <span>INITIATING VISUAL PROTOCOL...</span>
                                </div>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Right Panel - ANALYSIS_TERMINAL */}
          <div className="p-8">
            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 h-full flex flex-col relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]">
              <h2 className="text-cyan-400 text-sm font-mono uppercase tracking-widest mb-6 border-b border-cyan-500/30 pb-2 z-10">
                [ ANALYSIS_TERMINAL ]
              </h2>
              
              <div className="flex-1 flex flex-col items-center justify-center z-10">
                {/* Large QR Code with Diagonal Scan Animation */}
                <div className="relative mb-8 group">
                  <div className={`transition-all duration-500 ${loading ? 'opacity-100 scale-105' : 'opacity-70 scale-100'}`}>
                     <QrCode className="w-48 h-48 text-cyan-400" strokeWidth={1} />
                  </div>
                  
                  {/* The Scanning Laser Line */}
                   {loading && (
                    <motion.div 
                        className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)]"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                   )}

                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen"
                    style={{
                      background: 'repeating-linear-gradient(45deg, transparent 0%, transparent 48%, rgba(6,182,212,0.1) 50%, transparent 52%)',
                      backgroundSize: '200% 200%',
                      animation: loading ? 'diagonalScan 1s linear infinite' : 'none',
                      opacity: loading ? 1 : 0
                    }}
                  />
                </div>

                {/* Status Text - Typing Effect or Blinking Cursor */}
                <div className="text-center w-full max-w-md bg-black/80 border border-cyan-900/50 p-4 rounded text-xs">
                  <p className={`font-mono ${
                      terminalStatus.includes('WARNING') || terminalStatus.includes('FAILED') ? 'text-red-400' : 
                      terminalStatus.includes('COMPLETE') ? 'text-green-400' : 'text-cyan-400'
                  }`}>
                    <span className="opacity-50 mr-2">{">"}</span>
                    {terminalStatus}
                    <span className="animate-pulse ml-1">_</span>
                  </p>
                </div>

                {/* Toast Message (Retry Logic) */}
                <AnimatePresence>
                    {toastMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg max-w-md"
                    >
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                            <p className="text-yellow-400 font-mono text-sm">
                            {toastMessage}
                            </p>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

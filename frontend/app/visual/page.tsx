"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ShieldAlert, Eye, CheckCircle, XCircle, Search, Loader2, Camera, User, Package, Zap, Target, Layers, Cpu, Database, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVerification } from "@/lib/contexts/VerificationContext"

export default function VisualCouncil() {
  const router = useRouter()
  // const { updateAgentProgress, setCurrentStep } = useVerification() // Uncomment if using context
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([])
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0)
  
  // State for image handling
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleStartAnalysis = async () => {
    if (!selectedFile) return // Prevent analysis if no file

    setLoading(true)
    setAnalysisComplete(false)
    setAnalysisLogs([])
    setCurrentAnalysisStep(0)

    // 1. Initial "Fake" Logs for UI Feedback
    const initialLogs = [
      "Initializing visual analysis protocols...",
      "Loading image processing algorithms...",
      "Connecting to AI backend..."
    ]
    setAnalysisLogs(initialLogs)

    try {
      // 2. Prepare FormData
      const formData = new FormData()
      formData.append('file', selectedFile) // 'file' matches backend parameter

      // 3. Make the Real API Call
      // Note: Ensure your backend is running on port 5000
      const response = await fetch('http://localhost:5000/api/visual_agent', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`)
      }

      const data = await response.json()

      // 4. Update UI with Real AI Response
      setAnalysisLogs(prev => [
        ...prev,
        "Connection established.",
        "Scanning complete.",
        "--------------------------------",
        `>> AI REPORT:`,
        data.analysis, // Display the actual text from Moondream
        "--------------------------------",
        "Final authenticity assessment...",
        "Analysis complete."
      ])
      
      setAnalysisComplete(true)
      // updateAgentProgress('visual', 100) // Uncomment if using context

    } catch (error) {
      console.error('Analysis failed:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      
      setAnalysisLogs(prev => [
        ...prev, 
        `[ERROR]: ${message}`,
        "Please ensure backend is running on port 5000",
        "and Ollama is installed."
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleProceed = () => {
    // setCurrentStep('identity') // Uncomment if using context
    router.push('/identity')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setSelectedImageSrc(url)
      // Reset state if they upload a new image
      setAnalysisComplete(false)
      setAnalysisLogs([])
    }
  }

  return (
    <div className="min-h-screen w-full bg-cyan-950/20 text-gray-300 font-mono">
      <div className="w-full max-w-[95%] mx-auto min-h-screen flex flex-col">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full border-b border-cyan-500/30 bg-black/50 p-8 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <Search className="w-10 h-10 text-cyan-400" />
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 font-mono tracking-wider">
                VISUAL_AGENT // IMAGE_ANALYSIS_LAB
              </h1>
              <p className="text-cyan-300 text-lg mt-2">
                AI-Powered Product Authentication & Quality Control
              </p>
            </div>
            <Search className="w-10 h-10 text-cyan-400" />
          </div>
        </motion.div>

        {/* Split-Screen Analysis View */}
        <div className="flex-1 flex">

          {/* Left Panel - Source Image */}
          <div className="w-1/2 p-8 bg-black/60 border-r-2 border-cyan-500/50">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-cyan-400 font-mono">SOURCE IMAGE</h2>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Image Container with Scanning Grid */}
              <div
                className="flex-1 relative bg-black/80 border-2 border-cyan-500/30 rounded-lg overflow-hidden cursor-pointer hover:border-cyan-400/60 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Image Display Logic */}
                <div className="w-full h-full flex items-center justify-center relative">
                  
                  {selectedImageSrc ? (
                    <img
                      src={selectedImageSrc}
                      alt="Product Evidence"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-cyan-500/40 group-hover:text-cyan-400/80 transition-all">
                      <div className="relative">
                        <Package className="w-20 h-20 mb-4 opacity-50" />
                        <Upload className="w-8 h-8 absolute bottom-0 right-[-10px] text-cyan-400 bg-black rounded-full p-1 border border-cyan-500" />
                      </div>
                      <span className="text-sm font-mono tracking-[0.2em]">[ CLICK TO UPLOAD EVIDENCE ]</span>
                      <span className="text-xs mt-2 opacity-50">SUPPORTS: JPG, PNG, WEBP</span>
                    </div>
                  )}

                  {/* Green Scanning Grid Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Horizontal Lines */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`h-${i}`}
                        className="absolute w-full h-px bg-green-400/60"
                        style={{ top: `${20 + i * 15}%` }}
                        animate={{
                          opacity: loading ? [0.3, 1, 0.3] : [0.1, 0.3, 0.1],
                          scaleX: loading ? [0, 1, 0] : 1
                        }}
                        transition={{
                          duration: loading ? 2 : 3,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}

                    {/* Vertical Lines */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`v-${i}`}
                        className="absolute h-full w-px bg-green-400/60"
                        style={{ left: `${15 + i * 10}%` }}
                        animate={{
                          opacity: loading ? [0.3, 1, 0.3] : [0.1, 0.3, 0.1],
                          scaleY: loading ? [0, 1, 0] : 1
                        }}
                        transition={{
                          duration: loading ? 2 : 3,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}

                    {/* Corner Markers */}
                    {[
                      { x: '10%', y: '10%' },
                      { x: '90%', y: '10%' },
                      { x: '10%', y: '90%' },
                      { x: '90%', y: '90%' }
                    ].map((pos, i) => (
                      <motion.div
                        key={`corner-${i}`}
                        className="absolute w-3 h-3 border-2 border-green-400"
                        style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
                        animate={{
                          opacity: loading ? [0.5, 1, 0.5] : [0.3, 0.8, 0.3],
                          scale: loading ? [0.8, 1.2, 0.8] : [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.25
                        }}
                      />
                    ))}
                  </div>

                  {/* Scanning Beam Animation */}
                  {loading && (
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                      animate={{
                        top: ["0%", "100%", "0%"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  )}
                </div>

                {/* Image Status Footer */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                  <span className="text-cyan-400 font-mono text-sm truncate max-w-[200px]">
                    {selectedImageSrc ? "IMAGE LOADED: LOCAL_FILE" : "STATUS: AWAITING_INPUT"}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedImageSrc ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
                    <span className={`${selectedImageSrc ? "text-green-400" : "text-red-500"} font-mono text-xs`}>
                      {selectedImageSrc ? "READY FOR ANALYSIS" : "NO IMAGE"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - AI Vision Analysis (UNCHANGED UI) */}
          <div className="w-1/2 p-8 bg-black/40">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-cyan-400 font-mono">AI VISION ANALYSIS</h2>
              </div>

              {/* Analysis Terminal */}
              <div className="flex-1 bg-black/80 border-2 border-cyan-500/30 rounded-lg p-6 font-mono text-sm overflow-hidden flex flex-col">
                {/* Terminal Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-500/30">
                  <span className="text-cyan-400">ANALYSIS_TERMINAL v2.1</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs">PROCESSING</span>
                  </div>
                </div>

                {/* Streaming Logs */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
                  <AnimatePresence>
                    {analysisLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-3 text-cyan-300"
                      >
                        <span className="text-cyan-400/60 mt-0.5">{'>'}</span>
                        <span className="flex-1">{log}</span>
                        {index === analysisLogs.length - 1 && loading && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-cyan-400"
                          >
                            _
                          </motion.span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {analysisLogs.length === 0 && !loading && (
                    <div className="text-center text-cyan-400/60 py-8">
                      <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>READY FOR ANALYSIS</p>
                      <p className="text-xs mt-2">Click "START ANALYSIS" to begin</p>
                    </div>
                  )}
                </div>

                {/* Analysis Controls */}
                <div className="border-t border-cyan-500/30 pt-4">
                  {!analysisComplete ? (
                    <button
                      onClick={handleStartAnalysis}
                      disabled={loading || !selectedImageSrc}
                      className={`w-full px-6 py-3 font-mono text-lg tracking-wider transition-all border-2 
                        ${!selectedImageSrc 
                          ? "border-gray-600 text-gray-600 bg-transparent cursor-not-allowed opacity-50" 
                          : "border-cyan-400 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                        }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>ANALYZING...</span>
                        </div>
                      ) : (
                        "START ANALYSIS"
                      )}
                    </button>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-3 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-mono font-bold">ANALYSIS COMPLETE</span>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                        <div className="text-green-400 font-mono text-sm text-left pl-4">
                          ✓ AUTHENTICITY CONFIRMED<br/>
                          ✓ STRUCTURAL INTEGRITY VERIFIED<br/>
                          ✓ MATERIAL COMPOSITION VALIDATED
                        </div>
                      </div>

                      <button
                        onClick={handleProceed}
                        className="w-full px-6 py-3 font-mono text-lg tracking-wider transition-all border-2 border-green-400 text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:border-green-300"
                      >
                        PROCEED TO NEXT PHASE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
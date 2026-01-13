"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Fingerprint, Eye, Mic, CheckCircle, Loader2, ArrowRight, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVerification } from "@/lib/contexts/VerificationContext"

type AuthStage = 'idle' | 'fingerprint' | 'retinal' | 'voice' | 'complete'

export default function IdentityAgent() {
  const router = useRouter()
  const { updateAgentProgress, setCurrentStep } = useVerification()
  const [authStage, setAuthStage] = useState<AuthStage>('idle')
  const [personnelData, setPersonnelData] = useState<string | null>(null)
  const [operatorId, setOperatorId] = useState('')



  // Step 1: Fingerprint Scan
  const handleFingerprintScan = () => {
    if (authStage !== 'idle') return

    setAuthStage('fingerprint')

    // Simulate fingerprint scanning (2 seconds)
    setTimeout(() => {
      setAuthStage('retinal')
    }, 2000)
  }

  // Step 2: Retinal Scan (automatically triggered)
  useEffect(() => {
    if (authStage === 'retinal') {
      // Simulate retinal scanning (3 seconds)
      const timer = setTimeout(() => {
        setAuthStage('voice')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [authStage])

  // Step 3: Voice Scan (automatically triggered)
  useEffect(() => {
    if (authStage === 'voice') {
      // Simulate voice pattern matching (2 seconds)
      const timer = setTimeout(() => {
        setAuthStage('complete')
        updateAgentProgress('identity', 100)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [authStage])

  // Call API when complete
  useEffect(() => {
    if (authStage === 'complete' && !personnelData) {
      fetch('http://localhost:5000/api/identity_agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: operatorId, name: operatorId, auth_level: 'Level_4' })
      })
      .then(response => response.json())
      .then(data => setPersonnelData(data.log))
      .catch(error => {
        console.error(error)
        setPersonnelData('Error: Failed to verify identity')
      })
    }
  }, [authStage, personnelData, operatorId])

  const handleProceed = () => {
    setCurrentStep('courier')
    router.push('/courier')
  }

  return (
    <div className="min-h-screen w-full bg-black text-gray-300 font-mono">
      <div className="max-w-6xl mx-auto min-h-screen flex flex-col items-center justify-center p-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-cyan-400 font-mono tracking-wider mb-4">
            IDENTITY_AGENT
          </h1>
          <p className="text-cyan-300 text-xl">
            High-Security Multi-Factor Authentication
          </p>
        </motion.div>

        {/* Operator Input */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <label className="block text-cyan-400 font-mono text-sm mb-2">OPERATOR ID / NAME</label>
          <input
            type="text"
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            className="w-64 px-3 py-2 bg-black/60 border border-cyan-500/30 text-cyan-300 font-mono text-sm rounded focus:border-cyan-400 focus:outline-none"
            placeholder="Enter ID or Name"
          />
        </motion.div>

        {/* Step Indicators */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-12 mb-12"
        >
          {/* Fingerprint Step */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className={`w-16 h-16 rounded-full flex items-center justify-center border-3 ${
                authStage === 'fingerprint'
                  ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                  : authStage === 'retinal' || authStage === 'voice' || authStage === 'complete'
                  ? 'border-green-400 bg-green-400/20'
                  : 'border-gray-600 bg-gray-600/20'
              }`}
              animate={authStage === 'fingerprint' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: authStage === 'fingerprint' ? Infinity : 0 }}
            >
              <Fingerprint className={`w-8 h-8 ${
                authStage === 'fingerprint'
                  ? 'text-cyan-400'
                  : authStage === 'retinal' || authStage === 'voice' || authStage === 'complete'
                  ? 'text-green-400'
                  : 'text-gray-400'
              }`} />
            </motion.div>
            <span className={`text-sm font-mono font-bold ${
              authStage === 'fingerprint'
                ? 'text-cyan-400'
                : authStage === 'retinal' || authStage === 'voice' || authStage === 'complete'
                ? 'text-green-400'
                : 'text-gray-400'
            }`}>
              FINGERPRINT
            </span>
            <div className={`w-2 h-2 rounded-full ${
              authStage === 'fingerprint'
                ? 'bg-cyan-400 animate-pulse'
                : authStage === 'retinal' || authStage === 'voice' || authStage === 'complete'
                ? 'bg-green-400'
                : 'bg-gray-600'
            }`} />
          </div>

          <ArrowRight className={`w-8 h-8 ${
            authStage === 'retinal' || authStage === 'voice' || authStage === 'complete'
              ? 'text-green-400'
              : 'text-gray-600'
          }`} />

          {/* Retinal Step */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className={`w-16 h-16 rounded-full flex items-center justify-center border-3 ${
                authStage === 'retinal'
                  ? 'border-purple-400 bg-purple-400/20 shadow-[0_0_20px_rgba(147,51,234,0.6)]'
                  : authStage === 'voice' || authStage === 'complete'
                  ? 'border-green-400 bg-green-400/20'
                  : 'border-gray-600 bg-gray-600/20'
              }`}
              animate={authStage === 'retinal' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: authStage === 'retinal' ? Infinity : 0 }}
            >
              <Eye className={`w-8 h-8 ${
                authStage === 'retinal'
                  ? 'text-purple-400'
                  : authStage === 'voice' || authStage === 'complete'
                  ? 'text-green-400'
                  : 'text-gray-400'
              }`} />
            </motion.div>
            <span className={`text-sm font-mono font-bold ${
              authStage === 'retinal'
                ? 'text-purple-400'
                : authStage === 'voice' || authStage === 'complete'
                ? 'text-green-400'
                : 'text-gray-400'
            }`}>
              RETINAL SCAN
            </span>
            <div className={`w-2 h-2 rounded-full ${
              authStage === 'retinal'
                ? 'bg-purple-400 animate-pulse'
                : authStage === 'voice' || authStage === 'complete'
                ? 'bg-green-400'
                : 'bg-gray-600'
            }`} />
          </div>

          <ArrowRight className={`w-8 h-8 ${
            authStage === 'voice' || authStage === 'complete'
              ? 'text-green-400'
              : 'text-gray-600'
          }`} />

          {/* Voice Step */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              className={`w-16 h-16 rounded-full flex items-center justify-center border-3 ${
                authStage === 'voice'
                  ? 'border-orange-400 bg-orange-400/20 shadow-[0_0_20px_rgba(249,115,22,0.6)]'
                  : authStage === 'complete'
                  ? 'border-green-400 bg-green-400/20'
                  : 'border-gray-600 bg-gray-600/20'
              }`}
              animate={authStage === 'voice' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: authStage === 'voice' ? Infinity : 0 }}
            >
              <Mic className={`w-8 h-8 ${
                authStage === 'voice'
                  ? 'text-orange-400'
                  : authStage === 'complete'
                  ? 'text-green-400'
                  : 'text-gray-400'
              }`} />
            </motion.div>
            <span className={`text-sm font-mono font-bold ${
              authStage === 'voice'
                ? 'text-orange-400'
                : authStage === 'complete'
                ? 'text-green-400'
                : 'text-gray-400'
            }`}>
              VOICE PATTERN
            </span>
            <div className={`w-2 h-2 rounded-full ${
              authStage === 'voice'
                ? 'bg-orange-400 animate-pulse'
                : authStage === 'complete'
                ? 'bg-green-400'
                : 'bg-gray-600'
            }`} />
          </div>
        </motion.div>

        {/* Authentication Interface */}
        <AnimatePresence mode="wait">
          {/* Step 1: Fingerprint */}
          {(authStage === 'idle' || authStage === 'fingerprint') && (
            <motion.div
              key="fingerprint"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              {/* Single Central Button - No concentric rings */}
              <motion.div
                className="w-80 h-80 mx-auto mb-8 rounded-full border-4 border-cyan-500/50 bg-cyan-500/10 flex items-center justify-center cursor-pointer relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                whileHover={{ scale: 1.05, borderColor: 'rgba(6, 182, 212, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFingerprintScan}
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(6, 182, 212, 0.3)',
                    '0 0 50px rgba(6, 182, 212, 0.5)',
                    '0 0 30px rgba(6, 182, 212, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    filter: [
                      'drop-shadow(0 0 15px rgba(6, 182, 212, 0.5))',
                      'drop-shadow(0 0 25px rgba(6, 182, 212, 0.8))',
                      'drop-shadow(0 0 15px rgba(6, 182, 212, 0.5))'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <Fingerprint className="w-32 h-32 text-cyan-400 mx-auto mb-4" />
                  <div className="text-cyan-400 font-mono font-bold text-2xl">
                    {authStage === 'idle' ? 'TAP TO SCAN' : 'SCANNING FINGERPRINT...'}
                  </div>
                  <div className="text-cyan-300 font-mono text-lg mt-2">
                    Step 1: Biometric Handshake
                  </div>
                </motion.div>

                {/* Pulsing ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/60"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              <h2 className="text-3xl font-mono font-bold text-cyan-400 mb-4">
                STEP 1: BIOMETRIC HANDSHAKE
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Place your finger on the scanner to initiate multi-factor authentication
              </p>
            </motion.div>
          )}

          {/* Step 2: Retinal Scan */}
          {authStage === 'retinal' && (
            <motion.div
              key="retinal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              {/* Retinal Scanner with Grid */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                <motion.div
                  className="w-full h-full rounded-lg border-4 border-purple-500/50 bg-purple-500/10 flex items-center justify-center cursor-pointer relative overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.3)]"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(147, 51, 234, 0.3)',
                      '0 0 50px rgba(147, 51, 234, 0.5)',
                      '0 0 30px rgba(147, 51, 234, 0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {/* Scanning Beam */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_rgba(147,51,234,0.8)]"
                    animate={{
                      top: ["0%", "100%", "0%"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Grid Overlay */}
                  <div className="grid grid-cols-4 gap-2 w-full h-full p-4 opacity-40">
                    {[...Array(16)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="border border-purple-400/60 rounded"
                        animate={{
                          opacity: [0.4, 1, 0.4],
                          borderColor: ['rgba(147,51,234,0.6)', 'rgba(147,51,234,1)', 'rgba(147,51,234,0.6)']
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </div>

                  {/* Eye Icon */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      filter: [
                        'drop-shadow(0 0 15px rgba(147, 51, 234, 0.5))',
                        'drop-shadow(0 0 25px rgba(147, 51, 234, 0.8))',
                        'drop-shadow(0 0 15px rgba(147, 51, 234, 0.5))'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Eye className="w-24 h-24 text-purple-400" />
                  </motion.div>
                </motion.div>
              </div>

              <h2 className="text-3xl font-mono font-bold text-purple-400 mb-4">
                STEP 2: RETINAL ANALYSIS
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Scanning retinal patterns for enhanced security verification
              </p>
            </motion.div>
          )}

          {/* Step 3: Voice Pattern */}
          {authStage === 'voice' && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              {/* Voice Pattern Visualizer */}
              <motion.div
                className="w-80 h-80 mx-auto mb-8 rounded-lg border-4 border-orange-500/50 bg-orange-500/10 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(249, 115, 22, 0.3)',
                    '0 0 50px rgba(249, 115, 22, 0.5)',
                    '0 0 30px rgba(249, 115, 22, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Waveform Visualization */}
                <div className="flex items-end justify-center gap-1 h-32 mb-8">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-orange-400 rounded-full"
                      animate={{
                        height: [10, 40 + Math.random() * 60, 10],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                    />
                  ))}
                </div>

                {/* Microphone Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    filter: [
                      'drop-shadow(0 0 15px rgba(249, 115, 22, 0.5))',
                      'drop-shadow(0 0 25px rgba(249, 115, 22, 0.8))',
                      'drop-shadow(0 0 15px rgba(249, 115, 22, 0.5))'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mic className="w-24 h-24 text-orange-400" />
                </motion.div>
              </motion.div>

              <h2 className="text-3xl font-mono font-bold text-orange-400 mb-4">
                STEP 3: VOICE PATTERN VERIFICATION
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Analyzing voice pattern for final authentication layer
              </p>
            </motion.div>
          )}

          {/* Complete State */}
          {authStage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              {/* Success Display */}
              <motion.div
                className="w-80 h-80 mx-auto mb-8 rounded-full border-4 border-green-500 bg-green-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.5)]"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(34, 197, 94, 0.5)',
                    '0 0 60px rgba(34, 197, 94, 0.8)',
                    '0 0 30px rgba(34, 197, 94, 0.5)'
                  ],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-32 h-32 text-green-400" />
                </motion.div>
              </motion.div>

              <h2 className="text-4xl font-mono font-bold text-green-400 mb-4">
                MULTI-FACTOR AUTHENTICATION COMPLETE
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                All security layers verified successfully
              </p>

              {/* Personnel Data Card */}
              {personnelData && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-black/60 border border-green-500/30 rounded-lg p-6 max-w-md mx-auto mb-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-mono text-sm font-bold">SYSTEM LOG</span>
                  </div>
                  <p className="text-green-300 font-mono text-sm text-left">{personnelData}</p>
                </motion.div>
              )}

              {/* Next Step Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-3 text-green-400 mb-6"
              >
                <ArrowRight className="w-6 h-6" />
                <span className="font-mono text-lg">PROCEED TO COURIER AGENT</span>
              </motion.div>

              {/* Proceed Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                onClick={handleProceed}
                className="px-8 py-4 font-mono text-xl tracking-wider transition-all border-2 border-green-400 text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:border-green-300 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
              >
                PROCEED TO NEXT PHASE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

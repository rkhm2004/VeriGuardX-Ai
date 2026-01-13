"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Ensure this path matches your project structure
import { authenticateUser } from "@/lib/api" 
import { Loader2, ShieldCheck, User, Lock } from "lucide-react"
import { motion } from "framer-motion"

// --- PARTICLE INTERFACE (PRESERVED) ---
interface Particle {
  id: number
  x: number
  y: number
  duration: number
  delay: number
}

export default function Login() {
  // --- FIX: Initialize with empty strings to prevent auto-fill ---
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // --- BACKGROUND ANIMATION STATE (PRESERVED) ---
  const [particles, setParticles] = useState<Particle[]>([])
  const router = useRouter()

  // 1. Generate Particles (PRESERVED)
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2
        })
      }
      setParticles(newParticles)
    }
    generateParticles()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Call your authentication API
      const result = await authenticateUser(username, password)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/home") // Redirect to Dashboard
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* ========================================= */}
      {/* BACKGROUND EFFECTS (PRESERVED)            */}
      {/* ========================================= */}
      
      {/* Floating geometric patterns */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-500/20 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-cyan-500/10 rounded-full"
        animate={{
          rotate: -360,
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Rotating Squares */}
      <motion.div
        className="absolute top-1/2 left-1/6 w-24 h-24 border border-cyan-400/20 rounded-xl"
        animate={{
          rotate: 180,
          scale: [0.8, 1.2, 0.8],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
          />
        ))}
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none"></div>

      {/* ========================================= */}
      {/* NEW FOREGROUND UI (MODERN GLASS STYLE)    */}
      {/* ========================================= */}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-50 w-full max-w-md px-6"
      >
        {/* Modern Glass Card Container */}
        <div className="relative group">
          {/* Animated Glow Behind Card */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-1000"></div>
          
          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            
            {/* Header Section */}
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white tracking-widest mb-2 uppercase">
                VeriGuard<span className="text-cyan-400">X</span>
              </h1>
              <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">
                Secure Access Portal
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
                
                {/* --- INPUT FIELDS --- */}
                <div className="space-y-4">
                  
                  {/* Username Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      name="username_input_field" // Unique name to prevent browser autofill
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#111] border border-gray-800 text-gray-100 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 block pl-12 p-3.5 transition-all duration-300 placeholder-gray-600 shadow-inner"
                      placeholder="OPERATOR ID"
                      disabled={loading}
                      autoComplete="off"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      name="password_input_field" // Unique name to prevent browser autofill
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#111] border border-gray-800 text-gray-100 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 block pl-12 p-3.5 transition-all duration-300 placeholder-gray-600 shadow-inner"
                      placeholder="ACCESS CODE"
                      disabled={loading}
                      autoComplete="new-password" // Helps prevent aggressive password managers
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center tracking-wide"
                  >
                    {error}
                  </motion.div>
                )}

                {/* --- MODERN BUTTON --- */}
                <motion.button
                  type="submit"
                  disabled={loading || !username || !password}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group overflow-hidden rounded-lg p-[1px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-black h-full rounded-lg px-4 py-3.5 flex items-center justify-center transition-colors group-hover:bg-black/80">
                    <span className="text-cyan-100 font-semibold tracking-widest text-sm uppercase flex items-center">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Initialize Session'
                      )}
                    </span>
                  </div>
                </motion.button>

              </form>
            ) : (
              // --- SUCCESS STATE (MODERN) ---
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-green-500/10 border border-green-500/50 w-full h-full rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-green-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Access Granted</h2>
                <p className="text-gray-400 text-sm">Redirecting to Home Page...</p>
                
                {/* Loading Bar */}
                <div className="w-full bg-gray-800 h-1 mt-8 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-green-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Footer Text */}
          <div className="text-center mt-8">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">
              Sentinel Defense Matrix v2.4
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
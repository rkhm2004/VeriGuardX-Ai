"use client"

import { useRouter } from "next/navigation"
import {
  Shield,
  User,
  AlertTriangle,
  ShieldCheck,
  QrCode,
  Map,
  Truck,
  MessageSquare,
  LayoutDashboard
} from "lucide-react"
import { motion } from "framer-motion"
import VerificationRoadmap from "@/components/verification-roadmap"

export default function HomePage() {
  const router = useRouter()

  const navigationItems = [
    {
      icon: LayoutDashboard,
      title: "DASHBOARD",
      path: "/dashboard",
      color: "border-cyan-400 hover:border-cyan-300"
    },
    {
      icon: User,
      title: "IDENTITY AGENT",
      path: "/identity",
      color: "border-cyan-400 hover:border-cyan-300"
    },
    {
      icon: AlertTriangle,
      title: "ANOMALY AGENT",
      path: "/anomaly",
      color: "border-cyan-400 hover:border-cyan-300"
    },
    {
      icon: ShieldCheck,
      title: "RISK AGENT",
      path: "/risk",
      color: "border-cyan-400 hover:border-cyan-300"
    },
    {
      icon: QrCode,
      title: "SCAN AGENT",
      path: "/scan",
      color: "border-cyan-400 hover:border-cyan-300"
    },
    {
      icon: Map,
      title: "PROVENANCE AGENT",
      path: "/provenance",
      color: "border-cyan-400 hover:border-cyan-300"
    },
    {
      icon: Truck,
      title: "LOGIGUARD AGENT",
      path: "/courier",
      color: "border-cyan-400 hover:border-cyan-300"
    },
  ]

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Animated light streaks */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                left: '-100%',
                right: '100%',
                width: '200%'
              }}
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Glowing circuit nodes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 py-16">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 font-mono tracking-wider mb-4">
            VeriGuardX AI
          </h1>
          <motion.div
            className="text-cyan-300/60 text-xl font-mono"
            animate={{
              textShadow: [
                '0 0 20px rgba(6, 182, 212, 0.5)',
                '0 0 40px rgba(6, 182, 212, 0.8)',
                '0 0 20px rgba(6, 182, 212, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SECURE SUPPLY CHAIN VERIFICATION SYSTEM
          </motion.div>
        </motion.div>

        {/* Navigation Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 gap-8 max-w-4xl w-full"
        >
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(item.path)}
              // THIS IS THE CHANGE: Dashboard spans 2 columns
              className={`
                relative group p-8 bg-black/80 backdrop-blur-sm border-2 rounded-lg
                transition-all duration-300 hover:bg-black/90
                ${item.color}
                ${index === 0 ? 'col-span-2' : ''} 
              `}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{
                     background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))',
                     boxShadow: 'inset 0 0 20px rgba(6, 182, 212, 0.2)'
                   }} />

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="w-12 h-12 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </motion.div>

                <h3 className="text-xl font-mono font-bold text-cyan-300 group-hover:text-cyan-100 transition-colors">
                  {item.title}
                </h3>

                {/* Animated border effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-transparent"
                  animate={{
                    borderColor: ['rgba(6, 182, 212, 0)', 'rgba(6, 182, 212, 0.5)', 'rgba(6, 182, 212, 0)']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 text-center"
        >
          <p className="text-cyan-400/60 font-mono text-sm">
            Select an agent to begin verification process
          </p>
        </motion.div>
      </div>

      {/* Verification Roadmap Section */}
      <VerificationRoadmap />
    </div>
  )
}
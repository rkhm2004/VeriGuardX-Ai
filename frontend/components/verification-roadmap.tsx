"use client"

import { motion } from "framer-motion"
import {
  QrCode,
  User,
  Truck,
  Link,
  AlertTriangle,
  MessageSquare,
  ChevronRight
} from "lucide-react"

export default function VerificationRoadmap() {
  const steps = [
    {
      id: 1,
      title: "INITIATE",
      subtitle: "Scan Agent",
      description: "Start Verification & Intake Manifest",
      icon: QrCode,
      color: "from-cyan-400 to-blue-500",
      glowColor: "rgba(6, 182, 212, 0.6)"
    },
    {
      id: 2,
      title: "VALIDATE ENTITY",
      subtitle: "Identity Agent",
      description: "Verify Personnel & Credentials",
      icon: User,
      color: "from-blue-500 to-purple-500",
      glowColor: "rgba(59, 130, 246, 0.6)"
    },
    {
      id: 3,
      title: "VERIFY LOGISTICS",
      subtitle: "Courier Agent",
      description: "Check Vehicle & Transport Details",
      icon: Truck,
      color: "from-purple-500 to-pink-500",
      glowColor: "rgba(147, 51, 234, 0.6)"
    },
    {
      id: 4,
      title: "TRACE HISTORY",
      subtitle: "Provenance Agent",
      description: "Audit Chain of Custody & Ledger",
      icon: Link,
      color: "from-pink-500 to-red-500",
      glowColor: "rgba(236, 72, 153, 0.6)"
    },
    {
      id: 5,
      title: "ANALYZE RISK",
      subtitle: "Anomaly & Risk Agents",
      description: "Real-time Threat & Anomaly Detection",
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
      glowColor: "rgba(239, 68, 68, 0.6)"
    },
    {
      id: 6,
      title: "CONSULT SUPERVISOR",
      subtitle: "Council Agent",
      description: "AI-Powered Insights & Final Verdict",
      icon: MessageSquare,
      color: "from-orange-500 to-yellow-500",
      glowColor: "rgba(249, 115, 22, 0.6)"
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-16">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-bold font-mono tracking-wider mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400">
            {">>> MISSION PROTOCOL"}
          </span>
        </h2>
        <motion.div
          className="text-2xl md:text-3xl font-mono text-cyan-300/80 tracking-wider"
          animate={{
            textShadow: [
              '0 0 10px rgba(6, 182, 212, 0.5)',
              '0 0 20px rgba(6, 182, 212, 0.8)',
              '0 0 10px rgba(6, 182, 212, 0.5)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          // VERIFICATION ROADMAP //
        </motion.div>
      </motion.div>

      {/* Roadmap Timeline */}
      <div className="relative">
        {/* Central connecting line */}
        <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-30" />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="relative flex flex-col items-center"
            >
              {/* Step Circle */}
              <motion.div
                className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
                whileHover={{
                  scale: 1.1,
                  boxShadow: `0 0 30px ${step.glowColor}`
                }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${step.glowColor}`,
                    `0 0 40px ${step.glowColor}`,
                    `0 0 20px ${step.glowColor}`
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity },
                  scale: { type: "spring", stiffness: 300 }
                }}
              >
                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />

                {/* Icon */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-cyan-400">{step.id}</span>
                </div>
              </motion.div>

              {/* Step Content */}
              <motion.div
                className="text-center max-w-xs"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-lg font-mono font-bold text-cyan-300 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm font-mono text-cyan-400/60 mb-2">
                  {step.subtitle}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Connecting arrow (hidden on mobile) */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-10 -right-2 z-10"
                  animate={{
                    x: [0, 5, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  <ChevronRight className="w-6 h-6 text-cyan-400" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="text-center mt-16"
      >
        <motion.div
          className="inline-block px-8 py-4 bg-black/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm"
          animate={{
            borderColor: [
              'rgba(6, 182, 212, 0.3)',
              'rgba(6, 182, 212, 0.6)',
              'rgba(6, 182, 212, 0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-cyan-300 font-mono text-sm">
            Begin your verification journey above
          </p>
          <p className="text-cyan-400/60 font-mono text-xs mt-1">
            Each agent builds upon the previous verification
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

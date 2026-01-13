"use client"

import { motion } from "framer-motion"
import {
  Shield,
  QrCode,
  User,
  Truck,
  Link,
  AlertTriangle,
  MessageSquare
} from "lucide-react"

export default function CompositeSecurityBadge() {
  // Agent data for orbiting elements
  const agents = [
    { icon: QrCode, color: "#06b6d4", angle: 0 },     // Scan Agent - Cyan
    { icon: User, color: "#3b82f6", angle: 60 },      // Identity Agent - Blue
    { icon: Truck, color: "#8b5cf6", angle: 120 },    // Courier Agent - Purple
    { icon: Link, color: "#ec4899", angle: 180 },     // Provenance Agent - Pink
    { icon: AlertTriangle, color: "#ef4444", angle: 240 }, // Risk Agent - Red
    { icon: MessageSquare, color: "#f97316", angle: 300 } // Council Agent - Orange
  ]

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer circuit ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg className="w-full h-full" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="url(#circuitGradient)"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.6"
          />
          {/* Circuit pattern */}
          <circle cx="64" cy="6" r="2" fill="#06b6d4" />
          <circle cx="118" cy="64" r="2" fill="#3b82f6" />
          <circle cx="64" cy="122" r="2" fill="#8b5cf6" />
          <circle cx="10" cy="64" r="2" fill="#ec4899" />
        </svg>
      </motion.div>

      {/* Orbiting agent icons */}
      {agents.map((agent, index) => {
        const radius = 48
        const angle = (agent.angle * Math.PI) / 180
        const x = 64 + radius * Math.cos(angle)
        const y = 64 + radius * Math.sin(angle)

        return (
          <motion.div
            key={index}
            className="absolute w-6 h-6 flex items-center justify-center"
            style={{
              left: `${x - 12}px`,
              top: `${y - 12}px`
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, delay: index * 0.3 }
            }}
          >
            {/* Pulsing glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  `0 0 10px ${agent.color}40`,
                  `0 0 20px ${agent.color}80`,
                  `0 0 10px ${agent.color}40`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
            />

            {/* Circuit connection line */}
            <motion.div
              className="absolute w-12 h-0.5 origin-left"
              style={{
                background: `linear-gradient(90deg, ${agent.color}80, transparent)`,
                transform: `rotate(${agent.angle}deg)`,
                left: '-48px',
                top: '11px'
              }}
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />

            {/* Agent icon */}
            <motion.div
              className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${agent.color}20` }}
              animate={{
                borderColor: [agent.color, `${agent.color}80`, agent.color]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.1
              }}
            >
              <agent.icon className="w-3 h-3" style={{ color: agent.color }} />
            </motion.div>
          </motion.div>
        )
      })}

      {/* Central shield core */}
      <motion.div
        className="relative z-20"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          scale: { duration: 3, repeat: Infinity },
          rotate: { duration: 6, repeat: Infinity }
        }}
      >
        {/* Shield base */}
        <motion.div
          className="w-16 h-20 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-t-full relative overflow-hidden"
          animate={{
            boxShadow: [
              '0 0 20px rgba(6, 182, 212, 0.5)',
              '0 0 40px rgba(6, 182, 212, 0.8)',
              '0 0 20px rgba(6, 182, 212, 0.5)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Shield pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 64 80">
              {/* Hexagonal pattern */}
              <path
                d="M32 5 L50 15 L50 35 L32 45 L14 35 L14 15 Z"
                fill="none"
                stroke="white"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M32 10 L45 17 L45 33 L32 40 L19 33 L19 17 Z"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.3"
              />
              {/* Central V */}
              <text
                x="32"
                y="28"
                textAnchor="middle"
                className="text-xs font-bold fill-white"
                style={{ fontFamily: 'monospace' }}
              >
                VGX
              </text>
            </svg>
          </div>

          {/* Glitch effect overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
            animate={{
              opacity: [0, 0.1, 0],
              x: [-100, 100]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />

          {/* Energy particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>

        {/* Shield point */}
        <div className="w-16 h-4 bg-gradient-to-b from-blue-600 to-cyan-600 relative">
          <svg className="absolute -bottom-1 w-full h-4" viewBox="0 0 64 16">
            <path
              d="M32 0 L48 12 L32 16 L16 12 Z"
              fill="url(#shieldPoint)"
            />
          </svg>
        </div>
      </motion.div>

      {/* SVG Definitions */}
      <svg className="absolute" style={{ width: 0, height: 0 }}>
        <defs>
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#ec4899" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="shieldPoint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

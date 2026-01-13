"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-[0_0_10px_rgba(239,68,68,0.3)]",
        outline: "text-foreground border-slate-200 bg-white/50 backdrop-blur-sm",
        // New Futuristic Variants
        glow: "border-blue-400 bg-blue-500/10 text-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.4)] border-opacity-50",
        success: "border-emerald-400 bg-emerald-500/10 text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.4)] border-opacity-50",
        warning: "border-amber-400 bg-amber-500/10 text-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.4)] border-opacity-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean; // New prop for animation
}

function Badge({ className, variant, pulse, ...props }: BadgeProps) {
  // Use Framer Motion for the pulse effect if the prop is true
  const Component = pulse ? motion.div : "div"
  
  const pulseAnimation = pulse ? {
    animate: {
      opacity: [1, 0.6, 1],
      scale: [1, 1.03, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1],
    }
  } : {}

  return (
    <Component
      className={cn(badgeVariants({ variant }), className)}
      {...(pulseAnimation as any)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
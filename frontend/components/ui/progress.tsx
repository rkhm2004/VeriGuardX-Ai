"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { 
    variant?: "default" | "success" | "warning" | "destructive" 
  }
>(({ className, value, variant = "default", ...props }, ref) => {
  
  // Define variant colors and glows
  const variantStyles = {
    default: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    success: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    warning: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
    destructive: "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-900/10 backdrop-blur-sm border border-white/10 shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        asChild
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value || 0}%` }}
          transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] } as any}
          className={cn(
            "h-full w-full flex-1 transition-all relative",
            variantStyles[variant]
          )}
        >
          {/* Animated Highlight Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          
          {/* Subtle Striped Texture */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,rgba(255,255,255,0.4)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0.4)_75%,transparent_75%,transparent)] bg-[length:8px_8px]" />
        </motion.div>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
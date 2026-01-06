"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        {/* Animated focus glow background */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
        
        <input
          type={type}
          className={cn(
            "relative flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white/40 backdrop-blur-md px-4 py-2 text-sm font-medium ring-offset-background transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Futuristic bottom line accent */}
        <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-focus-within:w-1/2 group-focus-within:left-1/4" />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
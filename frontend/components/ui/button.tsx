"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-black uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]",
        destructive:
          "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]",
        outline:
          "border-2 border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-slate-50 hover:border-blue-400 text-slate-700",
        secondary:
          "bg-slate-900 text-white hover:bg-slate-800 shadow-lg",
        ghost: "hover:bg-blue-50 hover:text-blue-600",
        link: "text-blue-600 underline-offset-4 hover:underline",
        // New Cyberpunk Variant
        cyber: "relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-[0_0_20px_rgba(79,70,229,0.4)] overflow-hidden group",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-[10px]",
        lg: "h-12 px-10 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button
    
    // Framer Motion tap and hover effects
    const motionProps = asChild ? {} : {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.96 },
      transition: { type: "spring", stiffness: 400, damping: 15 } as any
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...motionProps}
        {...(asChild ? props as any : props)}
      >
        {variant === "cyber" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        )}
        {props.children as React.ReactNode}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

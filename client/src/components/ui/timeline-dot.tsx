"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function TimelineDot({
  className,
  isActive = false,
}: {
  className?: string
  isActive?: boolean
}) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("relative", className)}
    >
      <div className={cn("h-4 w-4 rounded-full border-2 border-primary", isActive ? "bg-primary" : "bg-background")} />
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 1.5,
          }}
          className="absolute inset-0 -z-10 h-4 w-4 rounded-full bg-primary/30"
        />
      )}
    </motion.div>
  )
}

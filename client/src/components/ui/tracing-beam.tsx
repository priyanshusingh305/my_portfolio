"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

export const TracingBeam = ({
  children,
  className,
  beamColor = "rgba(120, 119, 198, 0.35)",
  beamOpacity = 0.4,
}: {
  children: React.ReactNode
  className?: string
  beamColor?: string
  beamOpacity?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight)
    }
  }, [])

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.9], [50, svgHeight - 50]), {
    stiffness: 500,
    damping: 90,
  })

  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50]), {
    stiffness: 500,
    damping: 90,
  })

  return (
    <motion.div ref={ref} className={cn("relative w-full max-w-4xl mx-auto", className)}>
      <div className="absolute -left-4 md:left-8 top-3 bottom-0 w-0.5 md:w-1">
        <svg
          width="20"
          height={svgHeight}
          viewBox={`0 0 20 ${svgHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0"
        >
          <line x1="10" y1="0" x2="10" y2={svgHeight} stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" />
          <motion.line
            x1="10"
            y1={y1}
            x2="10"
            y2={y2}
            stroke={beamColor}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: `opacity(${beamOpacity})` }}
          />
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
      <div ref={contentRef} className="relative ml-4 md:ml-16">
        {children}
      </div>
    </motion.div>
  )
}

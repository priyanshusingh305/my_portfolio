"use client"

import type React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string | null) => void
  active: string | null
  item: string
  children?: React.ReactNode
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative px-3 py-2">
      <motion.p transition={{ duration: 0.3 }} className="cursor-pointer text-sm hover:opacity-[0.9] font-medium">
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.7rem)] left-1/2 transform -translate-x-1/2">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-card backdrop-blur-sm rounded-2xl overflow-hidden border border-border shadow-xl"
              >
                <div className="max-w-[500px] max-h-[70vh] overflow-auto p-6">{children}</div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void
  children: React.ReactNode
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-border bg-card shadow-input flex justify-center space-x-4 px-8 py-4 backdrop-blur-md"
    >
      {children}
    </nav>
  )
}

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link {...rest} className="text-sm font-medium relative hover:text-primary transition-colors py-2 px-1 block">
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-primary/10 rounded-md opacity-0 hover:opacity-100 transition-opacity" />
    </Link>
  )
}

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string
  description: string
  href: string
  src: string
}) => {
  return (
    <Link href={href} className="flex space-x-2 group">
      <div className="relative overflow-hidden rounded-xl w-16 h-16">
        <Image
          src={src || "/placeholder.svg"}
          width={64}
          height={64}
          alt={title}
          className="object-cover transition-all duration-300 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium group-hover:text-primary transition-colors">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </Link>
  )
}

"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function ScrollReveal({ children, className = "", delay = 0, once = true }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-100px" })
  const [hasBeenViewed, setHasBeenViewed] = useState(false)

  useEffect(() => {
    if (isInView && !hasBeenViewed) {
      setHasBeenViewed(true)
    }
  }, [isInView, hasBeenViewed])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

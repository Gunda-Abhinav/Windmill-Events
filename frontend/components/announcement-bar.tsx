"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Sparkles, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  // Announcement content - can be made dynamic by fetching from API
  const announcements = [
    {
      text: "🎉 Upcoming Event: Hearts and Beats - Register Now!",
      link: "/events",
    },
    {
      text: "🎉 Upcoming Event: Hearts and Beats - Register Now!",
      link: "/events",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 5000) // Change announcement every 5 seconds

    return () => clearInterval(interval)
  }, [announcements.length])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-[64px] md:top-[72px] z-40 bg-gradient-to-r from-primary/90 via-accent/90 to-secondary/90 backdrop-blur-md border-b border-border/50 overflow-hidden"
    >
      <Link href={announcements[currentIndex].link} className="block">
        <div className="container mx-auto px-4 py-3 relative group cursor-pointer">
          {/* Animated background shimmer */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          
          <div className="flex items-center justify-center gap-3 text-white relative">
            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            </motion.div>

            {/* Scrolling text container */}
            <div className="flex-1 overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <span className="text-sm md:text-base font-semibold tracking-wide">
                  {announcements[currentIndex].text}
                </span>
              </motion.div>
            </div>

            {/* Arrow icon */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex-shrink-0 group-hover:scale-110 transition-transform"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.div>

            {/* Calendar icon */}
            <Calendar className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 opacity-80" />
          </div>

          {/* Progress indicator dots */}
          {announcements.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2">
              {announcements.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Optional close button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          setIsVisible(false)
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
        aria-label="Close announcement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Play, Calendar, Star } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, Suspense } from "react"
import Link from "next/link"

export function HeroVideo() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
     
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
          <motion.img
            src="/home-hero-image.avif"
            // src="/indian-wedding-ceremony-with-mandap.jpg"
            alt="Elegant Indian wedding ceremony"
            className="w-full h-full object-cover opacity-90"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/40" />
      </motion.div>

      <motion.div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center space-x-4 mb-6"
          >
            {[0, 0.5, 1].map((delay, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Sparkle size={i === 1 ? "md" : "lg"} className={i === 1 ? "text-primary" : "text-accent"} />
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="block"
            >
              {/* Authentic Cultural Events */}
              Authentic Indian Celebrations
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="block text-primary dark:text-white"
            >
              {/* Crafted with Love */}
              Planned End-to-End
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            {/* Exquisite end-to-end event experiences with cultural authenticity, health-forward cocktails, and
            professional-grade production. Founded by Indians in the US, for celebrations that matter. */}
            From pre-wedding functions to milestone birthdays, festivals, sangeet nights, housewarmings, and 
            family gatherings, we handle the complete planning, decor, music, and coordination for your
            Bay Area event.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 py-6"
          >
            {[
              { icon: Star, text: "30+ Events", fill: true },
              { icon: Calendar, text: "2+ Years Experience", fill: false },
              { icon: Sparkle, text: "Cultural Authenticity", fill: false },
            ].map((stat, index) => (
              <motion.div
                key={stat.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <stat.icon className={`w-5 h-5 text-accent ${stat.fill ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">{stat.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                  Book Your Event
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/gallery">
                <Button size="lg" 
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-3 bg-transparent dark:text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Our Story
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="pt-8"
          >
            <p className="text-sm mb-4">Trusted by families across the Bay Area</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs font-medium">San Francisco</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">San Jose</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">Sacremento</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">Fremont</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">Dublin/Pleasanton</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">Mountain House</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

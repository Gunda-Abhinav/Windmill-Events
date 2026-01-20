"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"
import { services } from "@/data/dummy-data"
import type { Event } from "@/data/dummy-data"
import { motion, AnimatePresence } from "framer-motion"

interface LightboxModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export function LightboxModal({ event, isOpen, onClose }: LightboxModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageDirection, setImageDirection] = useState(0)

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [event])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentImageIndex, event])

  if (!event) return null

  const nextImage = () => {
    setImageDirection(1)
    setCurrentImageIndex((prev) => (prev + 1) % event.media.length)
  }

  const prevImage = () => {
    setImageDirection(-1)
    setCurrentImageIndex((prev) => (prev - 1 + event.media.length) % event.media.length)
  }

 
  const eventTypeColors = {
    wedding: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    cultural: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    corporate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    birthday: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="relative aspect-[16/10] bg-black overflow-hidden">
            <AnimatePresence mode="wait" custom={imageDirection}>
              <motion.img
                key={currentImageIndex}
                custom={imageDirection}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                src={event.media[currentImageIndex] || "/placeholder.svg"}
                alt={`${event.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x
                  if (swipe < -10000) nextImage()
                  else if (swipe > 10000) prevImage()
                }}
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {event.media.length > 1 && (
              <>
                <motion.div
                  whileHover={{ scale: 1.1, x: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="bg-black/20 hover:bg-black/40 text-white rounded-full w-12 h-12 p-0"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, x: 4 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="bg-black/20 hover:bg-black/40 text-white rounded-full w-12 h-12 p-0"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </motion.div>
              </>
            )}

            {/* Image Counter */}
            {event.media.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm"
              >
                {currentImageIndex + 1} / {event.media.length}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-background"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">{event.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <Badge className={eventTypeColors[event.type]} variant="secondary">
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>

            {/* Thumbnail Navigation */}
            {event.media.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {event.media.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setImageDirection(index > currentImageIndex ? 1 : -1)
                      setCurrentImageIndex(index)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"
import type { Service } from "@/data/dummy-data"
import { motion } from "framer-motion"
import { hoverLift } from "@/lib/animations"

interface ServiceCardProps {
  service: Service
  onClick: () => void
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <motion.div variants={hoverLift} initial="rest" whileHover="hover" whileTap="tap" className="h-full">
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden h-full relative">
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
            <motion.img
              src={service.media[0] || "/placeholder.svg"}
              alt={service.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          </div>
          
          {/* Premium Badge - Star and tag */}
          {/* {service.isPremium && (
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )} */}
        </div>

        <CardContent className="p-6">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl mb-4 inline-block"
          >
            {service.icon}
          </motion.div>

          <h3 className="font-serif text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{service.summary}</p>
          

          <div className="flex items-center justify-between mb-4">
            {/* <span className="text-sm font-semibold text-primary">{service.price}</span> */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClick}
              className="group/btn text-muted-foreground hover:text-primary"
            >
              Learn More
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                <ArrowRight className="w-4 h-4 ml-1" />
              </motion.div>
            </Button>
          </div>

          <div className="space-y-1">
            {service.highlights.slice(0, 2).map((highlight, index) => (
              <div key={index} className="flex items-center text-xs text-muted-foreground">
                <div className="w-1 h-1 bg-accent rounded-full mr-2"></div>
                {highlight}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

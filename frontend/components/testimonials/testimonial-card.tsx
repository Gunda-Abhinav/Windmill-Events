"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, Eye } from "lucide-react"
import type { Testimonial } from "@/data/dummy-data"

interface TestimonialCardProps {
  testimonial: Testimonial
  onClick: () => void
}

export function TestimonialCard({ testimonial, onClick }: TestimonialCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-accent fill-current" />
            ))}
          </div>
          <Quote className="w-6 h-6 text-muted-foreground/30" />
        </div>

        <blockquote className="text-muted-foreground leading-relaxed mb-6 flex-grow line-clamp-4">
          "{testimonial.text}"
        </blockquote>

        <div className="space-y-3">
          <div>
            <div className="font-semibold text-foreground">{testimonial.name}</div>
          </div>

          <div className="flex items-center justify-between">
            {testimonial.eventType && (
              <Badge variant="secondary" className="text-xs">
                {testimonial.eventType}
              </Badge>
            )}

            {/* TO DO: Remove if not needed */}

            {/* <button
              onClick={onClick}
              className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-primary transition-colors group-hover:text-primary"
            >
              <Eye className="w-3 h-3" />
              <span>Read Full Review</span>
            </button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

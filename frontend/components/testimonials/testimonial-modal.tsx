"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, Calendar } from "lucide-react"
import type { Testimonial } from "@/data/dummy-data"

interface TestimonialModalProps {
  testimonial: Testimonial | null
  isOpen: boolean
  onClose: () => void
}

export function TestimonialModal({ testimonial, isOpen, onClose }: TestimonialModalProps) {
  if (!testimonial) return null

  // Extended testimonial details for modal
  // TO DO: Remove if not needed.
  const extendedDetails = {
    "1": {
      fullReview:
        "Windmill Events made our dream wedding come true! From the initial consultation to the last dance, every detail was perfect. The team understood our vision for a traditional Indian ceremony with modern touches. The mandap was absolutely stunning with fresh marigolds and elegant draping. The health-conscious cocktails were a huge hit - our guests loved the fresh fruit combinations with honey. The dancing on cloud effect during our first dance was magical and created the most romantic moment. Vikram and his team were professional, responsive, and genuinely cared about making our day special. We couldn't have asked for a better experience!",
      eventDetails: "Traditional Indian Wedding, 300 guests, San Francisco",
      date: "March 15, 2024",
      services: ["Full Event Management", "Traditional Decor", "DJ Services", "Health-Forward Bar", "Special Effects"],
    }
  }

  const details = extendedDetails[testimonial.id as keyof typeof extendedDetails] || {
    fullReview: testimonial.text,
    eventDetails: "Private Event",
    date: "2024",
    services: [],
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="font-serif text-2xl text-foreground">{testimonial.name}</DialogTitle>
            </div>
            <div className="flex">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-accent fill-current" />
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Review */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Quote className="w-12 h-12 text-accent/20 absolute -top-2 -left-2" />
              <blockquote className="text-foreground leading-relaxed text-lg pl-8">{details.fullReview}</blockquote>
            </div>

            {testimonial.media && (
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                <img
                  src={testimonial.media || "/placeholder.svg"}
                  alt={`${testimonial.name}'s event`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{details.date}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{details.eventDetails}</span>
                </div>
                {testimonial.eventType && (
                  <Badge className="bg-primary text-primary-foreground">{testimonial.eventType}</Badge>
                )}
              </div>
            </div>

            {details.services.length > 0 && (
              <div>
                <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Services Provided</h3>
                <div className="space-y-2">
                  {details.services.map((service, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">Overall Rating</h3>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-accent fill-current" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-foreground">{testimonial.rating}/5</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
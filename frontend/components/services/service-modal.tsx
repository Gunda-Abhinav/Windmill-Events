"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Phone } from "lucide-react"
import type { Service } from "@/data/dummy-data"

interface ServiceModalProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{service.icon}</div>
              <div>
                <DialogTitle className="font-serif text-2xl text-foreground">{service.title}</DialogTitle>
                {/* {service.isPremium && (
                  <Badge className="mt-2 bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Premium Service
                  </Badge>
                )} */}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
              <img
                src={service.media[0] || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            {service.media.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {service.media.slice(1, 4).map((image, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${service.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-lg font-semibold mb-3">Service Overview</h3>
              <p className="text-muted-foreground leading-relaxed">{service.summary}</p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-3">What's Included</h3>
              <ul className="space-y-2">
                {service.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              {/* <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-lg font-semibold">Pricing</span>
                <span className="text-xl font-bold text-primary">{service.price}</span>
              </div> */}
              <p className="text-sm text-muted-foreground mb-4">
                Final pricing depends on event size, location, and specific requirements. Contact us for a personalized
                quote.
              </p>
              {/* ADD CONTACT IF NEEDED */}
              {/* <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

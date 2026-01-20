"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface EventData {
  id: string
  title: string
  slug: string
  description: string
  eventDate: string
  venue: string
  venueAddress: string
  pricing: {
    currentPrice: number
    regularPrice: number
    earlyBirdPrice: number | null
    isEarlyBird: boolean
  }
  banner: {
    url: string | null
    altText: string
  }
}

interface EventCardProps {
  event: EventData
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden">
      <div className="relative">
        <div className="aspect-[2/1] bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          {event.banner.url ? (
            <img
              src={event.banner.url}
              alt={event.banner.altText}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600">
              <div className="text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                <p className="text-sm opacity-90">{formatDate(event.eventDate)}</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              {event.pricing.isEarlyBird && (
                <Badge className="bg-green-500 text-white hover:bg-green-600" variant="secondary">
                  Early Bird Pricing
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-semibold text-primary">
            <DollarSign className="w-4 h-4" />
            <span>
              ${event.pricing.currentPrice.toFixed(2)} per pass
              {event.pricing.isEarlyBird && event.pricing.regularPrice && (
                <span className="ml-2 text-xs text-muted-foreground line-through">
                  ${event.pricing.regularPrice.toFixed(2)}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {event.pricing.isEarlyBird ? (
              <span className="text-green-600 font-medium">🎉 Early Bird Active</span>
            ) : (
              <span>Regular Pricing</span>
            )}
          </div>

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/events/${event.slug}/register`)
            }}
          >
            Register Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

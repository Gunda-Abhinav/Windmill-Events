"use client"

import { useState, useEffect } from "react"
import { EventCard } from "@/components/events/event-card"

interface EventData {
  id: string
  title: string
  slug: string
  description: string
  eventDate: string
  eventEndDate: string | null
  registrationDeadline: string | null
  venue: string
  venueAddress: string
  pricing: {
    currentPrice: number
    regularPrice: number
    earlyBirdPrice: number | null
    earlyBirdDeadline: string | null
    isEarlyBird: boolean
  }
  capacity: {
    max: number | null
    available: number | null
  }
  status: string
  contact: {
    name: string | null
    email: string | null
    phone: string | null
  }
  banner: {
    url: string | null
    altText: string
  }
}

export function EventsGallery() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
        const response = await fetch(`${apiUrl}/events`)
        const data = await response.json()

        if (data.ok) {
          setEvents(data.events)
        } else {
          setError('Failed to load events')
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming events at this time.</p>
          </div>
        )}
      </div>
    </section>
  )
}

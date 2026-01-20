"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, ExternalLink } from "lucide-react"
import Link from "next/link"

interface EventData {
  id: string
  title: string
  slug: string
  banner: {
    url: string | null
  }
}

export function InstagramReel() {
  const [instagramPosts, setInstagramPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
        const response = await fetch(`${apiUrl}/events`)
        const data = await response.json()

        if (data.ok && data.events) {
          // Use event banners as Instagram-style posts
          const posts = data.events.slice(0, 6).map((event: EventData) => ({
            id: event.id,
            image: event.banner.url,
            caption: event.title,
            likes: Math.floor(Math.random() * 500) + 100,
            slug: event.slug,
          }))
          setInstagramPosts(posts)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading || instagramPosts.length === 0) {
    return null // Don't show the section if no events
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Instagram className="w-8 h-8 text-primary" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Follow Our Journey</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get inspired by our latest events and behind-the-scenes moments. Follow us for daily doses of celebration
            magic.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {instagramPosts.map((post) => (
            <Card
              key={post.id}
              className="group cursor-pointer overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-white text-xs font-medium truncate">{post.caption}</div>
                    <div className="text-white/80 text-xs">❤️ {post.likes}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="https://www.instagram.com/windmill_for_events"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Instagram className="w-4 h-4 mr-2" />
              Follow @windmillevents
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Star } from "lucide-react"

export function VideoTestimonials() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const videoTestimonials = [
    {
      id: "1",
      thumbnail: "/indian-wedding-ceremony-with-mandap.jpg",
      title: "Priya & Arjun's Wedding Story",
      duration: "2:34",
      client: "Priya & Arjun Sharma",
      rating: 5,
      preview: "Our dream wedding came true with Windmill Events...",
    },
    {
      id: "2",
      thumbnail: "/diwali-celebration-with-diyas-and-rangoli.jpg",
      title: "Community Diwali Celebration",
      duration: "1:45",
      client: "Rajesh Patel",
      rating: 5,
      preview: "The most authentic Diwali celebration our community has ever had...",
    },
    {
      id: "3",
      thumbnail: "/corporate-gala-with-elegant-lighting.jpg",
      title: "TechCorp Annual Gala Success",
      duration: "1:28",
      client: "Sarah Chen, TechCorp",
      rating: 5,
      preview: "Professional, creative, and exceeded all our expectations...",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Video Testimonials</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Hear directly from our clients as they share their experiences and the joy we helped create.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoTestimonials.map((video) => (
            <Card
              key={video.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden"
            >
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </Button>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {video.title}
                </h3>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex">
                    {[...Array(video.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">by {video.client}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{video.preview}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Modal Placeholder */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="bg-background rounded-lg p-6 max-w-4xl w-full">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Video testimonial would play here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    In a real implementation, this would integrate with a video player
                  </p>
                </div>
              </div>
              <Button onClick={() => setSelectedVideo(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

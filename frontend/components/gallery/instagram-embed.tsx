import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

export function InstagramEmbed() {
  // Mock Instagram posts
  const instagramPosts = [
    {
      id: "1",
      image: "/indian-wedding-ceremony-with-mandap.jpg",
      caption: "Beautiful mandap ceremony with traditional marigold decorations ✨",
      likes: 234,
      comments: 18,
      timestamp: "2 days ago",
    },
    {
      id: "2",
      image: "/diwali-celebration-with-diyas-and-rangoli.jpg",
      caption: "Diwali celebration filled with lights, joy, and authentic traditions 🪔",
      likes: 189,
      comments: 12,
      timestamp: "5 days ago",
    },
    {
      id: "3",
      image: "/fresh-fruit-cocktails-with-mint-and-honey.jpg",
      caption: "Health-forward cocktails made with fresh fruits and honey 🍹",
      likes: 156,
      comments: 8,
      timestamp: "1 week ago",
    },
    {
      id: "4",
      image: "/led-dance-floor-with-colorful-lights.jpg",
      caption: "LED dance floor bringing the party to life! 💃",
      likes: 298,
      comments: 24,
      timestamp: "1 week ago",
    },
    {
      id: "5",
      image: "/dancing-on-cloud.png",
      caption: "Dancing on clouds - creating magical moments ☁️",
      likes: 412,
      comments: 31,
      timestamp: "2 weeks ago",
    },
    {
      id: "6",
      image: "/360-photo-booth.png",
      caption: "360° photo booth fun with our amazing guests! 📸",
      likes: 167,
      comments: 15,
      timestamp: "2 weeks ago",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Instagram className="w-8 h-8 text-primary" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">@windmill_for_events</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Follow us on Instagram for daily inspiration, behind-the-scenes moments, and the latest from our events.
          </p>
        </div>

        {/* Duplicate Gallery to remove */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {instagramPosts.map((post) => (
            <Card
              key={post.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden"
            >
              <div className="relative aspect-square">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Instagram post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm line-clamp-2 mb-2">{post.caption}</p>
                    <div className="flex items-center justify-between text-white/80 text-xs">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div> */}

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

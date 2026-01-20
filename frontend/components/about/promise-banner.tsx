import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Heart, Star } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"
import Link from "next/link"

export function PromiseBanner() {
  const promises = [
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Every service meets our exquisite standards",
    },
    {
      icon: Clock,
      title: "Timely Delivery",
      description: "Your event starts exactly when planned",
    },
    {
      icon: Heart,
      title: "Personal Care",
      description: "Treated like our own family celebration",
    },
    {
      icon: Star,
      title: "Cultural Authenticity",
      description: "Traditions honored with modern elegance",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto border-border/50 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="flex justify-center space-x-2 mb-6">
                <Sparkle size="lg" className="text-accent animate-float" />
                <Sparkle size="md" className="text-primary animate-float" style={{ animationDelay: "0.5s" }} />
                <Sparkle size="lg" className="text-accent animate-float" style={{ animationDelay: "1s" }} />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Our Promise to You</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                When you choose Windmill Events, you're not just hiring a service provider – you're partnering with
                a team that genuinely cares about making your celebration perfect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {promises.map((promise, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <promise.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">{promise.title}</h3>
                  <p className="text-sm text-muted-foreground">{promise.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Ready to experience the Windmill Events difference? Let's start planning your perfect celebration.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Planning
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button variant="outline" size="lg" className="bg-transparent">
                    Schedule Call
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

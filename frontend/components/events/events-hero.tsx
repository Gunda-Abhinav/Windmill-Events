import { Calendar, MapPin, Users } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"

export function EventsHero() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center space-x-2 mb-6">
            <Sparkle size="lg" className="text-accent animate-float" />
            <Sparkle size="md" className="text-primary animate-float" style={{ animationDelay: "0.5s" }} />
            <Sparkle size="lg" className="text-accent animate-float" style={{ animationDelay: "1s" }} />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Our Upcoming Events
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            Experience what’s next! Explore our upcoming events
            crafted with passion, creativity, and love. Join us as we bring unforgettable experiences 
            to life. <br/>One celebration at a time.
          </p>
          {/* Hiding the cou */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Events Completed</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">Bay Area</div>
                <div className="text-sm text-muted-foreground">Service Region</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Users className="w-6 h-6 text-primary" />
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">50-500</div>
                <div className="text-sm text-muted-foreground">Guest Capacity</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}

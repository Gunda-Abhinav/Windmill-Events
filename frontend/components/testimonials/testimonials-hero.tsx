import { Star, Quote } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"

export function TestimonialsHero() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center space-x-2 mb-6">
            <Sparkle size="lg" className="text-accent animate-float" />
            <Quote className="w-8 h-8 text-primary animate-pulse" />
            <Sparkle size="lg" className="text-accent animate-float" style={{ animationDelay: "1s" }} />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Stories of Joy
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            The greatest testament to our work comes from the families we've served. Here are their stories, their joy,
            and their memories that we were honored to help create.
          </p>

          <div className="flex justify-center items-center space-x-8 mt-12 pt-8 border-t border-border/50">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-current" />
                ))}
              </div>
              <div className="text-2xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Would Recommend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Sparkle } from "@/components/ui/sparkle"

export function ServicesHero() {
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
            Exquisite Event Services
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            We specialize in Indian and South Asian events across the Bay Area. Our team partners with families to plan and run every part of your celebration with care and cultural understanding.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">40+</div>
              <div className="text-sm text-muted-foreground">Events Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">8+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">9</div>
              <div className="text-sm text-muted-foreground">Service Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Cultural Authenticity</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

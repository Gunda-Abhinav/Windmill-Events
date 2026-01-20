import { Sparkle } from "@/components/ui/sparkle"

export function ContactHero() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10">
          <Sparkle className="w-4 h-4 text-accent animate-pulse" />
        </div>
        <div className="absolute top-40 right-20">
          <Sparkle className="w-6 h-6 text-primary animate-pulse delay-300" />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <Sparkle className="w-5 h-5 text-secondary animate-pulse delay-700" />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 text-balance">
          Let's Create Your
          <span className="text-primary block">Perfect Event</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Ready to bring your vision to life? Get in touch with our team of event specialists and let's start planning
          something extraordinary together.
        </p>
      </div>
    </section>
  )
}

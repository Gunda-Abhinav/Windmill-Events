import { Receipt, MapPin, Shuffle, Music, ClipboardCheck, BookOpen } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"

export function AboutHero() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Sparkle size="lg" className="text-accent animate-float" />
                <Sparkle size="md" className="text-primary animate-float" style={{ animationDelay: "0.5s" }} />
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Our Story
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 text-pretty">
                Windmill Events is a Bay Area team that understands the cultural and emotional importance of Indian
                celebrations. We bring together planning, decor, sound, dance floors, and entertainment under one roof.
              </p>

              <div className="space-y-3">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">What Makes Us Different...</h2>
                
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">Deep understanding of Indian traditions</h3>
                    {/* <p className="text-muted-foreground">
                      We understand the nuances of traditional ceremonies while embracing modern celebration styles.
                    </p> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">End-to-end planning</h3>
                    {/* <p className="text-muted-foreground">
                      Professional-grade equipment and health-forward approaches in everything we do.
                    </p> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Music className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">In-house DJ, LED floor, decor team</h3>
                    {/* <p className="text-muted-foreground">
                      Every event is treated as if it were our own family celebration.
                    </p> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shuffle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">Flexible themes and rituals</h3>
                    {/* <p className="text-muted-foreground">
                      Every event is treated as if it were our own family celebration.
                    </p> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">Bay Area based and fully local</h3>
                    {/* <p className="text-muted-foreground">
                      Every event is treated as if it were our own family celebration.
                    </p> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">Transparent pricing</h3>
                    {/* <p className="text-muted-foreground">
                      Every event is treated as if it were our own family celebration.
                    </p> */}
                  </div>
                </div>

              </div>
            </div>

            {/* Image */}
            <div className="relative">
              {/* <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <img
                  src="/windmillEventsLogo.png"
                  // src="/indian-wedding-ceremony-with-mandap.jpg"
                  alt="Traditional Indian wedding ceremony"
                  className="w-full h-full object-contain p-6 bg-white rounded-2xl"
                />
              </div> */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted/30 flex items-center justify-center">
                <img
                  src="/windmillEventsLogo.png"
                  alt="Windmill Events Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

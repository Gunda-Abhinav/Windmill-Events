import { Card, CardContent } from "@/components/ui/card"
import { Heart, Award, Users } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"

export function WhyUs() {
  const reasons = [
    {
      icon: Heart,
      title: "Cultural Authenticity",
      description:
        "Founded by Indians in the US, we understand the nuances of traditional ceremonies while embracing modern celebrations.",
      highlight: "Authentic traditions meet contemporary style",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Professional-grade equipment including Bose L1 Pro32 arrays, health-forward cocktails with fresh ingredients, and meticulous attention to detail.",
      highlight: "No compromise on quality or authenticity",
    },
    {
      icon: Users,
      title: "End-to-End Experience",
      description:
        "From initial planning to final cleanup, we handle every aspect of your event so you can focus on creating memories with your loved ones.",
      highlight: "Complete peace of mind for your special day",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Sparkle size="lg" className="text-accent" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Windmill Events?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We're not just event planners – we're cultural storytellers who bring your vision to life with authenticity,
            quality, and heart.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <Card key={index} className="text-center border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <reason.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{reason.description}</p>
                <div className="text-sm font-medium text-accent bg-accent/10 px-3 py-2 rounded-full inline-block">
                  {reason.highlight}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

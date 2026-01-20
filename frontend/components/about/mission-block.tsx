import { Card, CardContent } from "@/components/ui/card"
import { Compass, Target, Lightbulb } from "lucide-react"

export function MissionBlock() {
  const values = [
    {
      icon: Compass,
      title: "Our Mission",
      description:
        "To create authentic cultural celebrations that honor traditions while embracing modern elegance, bringing families and communities together through unforgettable experiences.",
    },
    {
      icon: Target,
      title: "Our Vision",
      description:
        "To be the premier cultural event company in the Bay Area, known for our authenticity, quality, and the magical moments we create for every celebration.",
    },
    {
      icon: Lightbulb,
      title: "Our Values",
      description:
        "Authenticity, quality, family, tradition, innovation, and health-consciousness guide every decision we make and every event we craft.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">What Drives Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our foundation is built on deep cultural understanding, unwavering quality standards, and genuine care for
            every celebration we touch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

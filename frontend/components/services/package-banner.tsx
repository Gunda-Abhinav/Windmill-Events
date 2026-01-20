import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Gift, Sparkles } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"
import Link from "next/link"
export function PackageBanner() {
  const packages = [
    {
      icon: Gift,
      title: "Essential Package",
      description: "Perfect for intimate celebrations",
      services: ["Event Management", "Basic Decor", "DJ Setup", "Fresh Cocktails"],
      // price: "Starting at $3,500",
      popular: false,
    },
    {
      icon: Crown,
      title: "Premium Package",
      description: "Our most popular comprehensive package",
      services: [
        "Full Event Management",
        "Premium Decor",
        "Professional DJ",
        "Health-Forward Bar",
        "LED Dance Floor",
        "Cold Sparkles",
      ],
      // price: "Starting at $6,500",
      popular: true,
    },
    {
      icon: Sparkles,
      title: "Luxury Package",
      description: "The ultimate celebration experience",
      services: [
        "Complete Event Production",
        "Luxury Decor & Styling",
        "Premium Audio/Visual",
        "Craft Cocktail Bar",
        "All Special Effects",
        "Photo/Video",
        "360° Booth",
      ],
      // price: "Starting at $xxx",
      popular: false,
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Sparkle size="lg" className="text-accent animate-float" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Event Packages</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose from our carefully curated packages or let us create a custom solution for your unique celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative border-border/50 hover:shadow-xl transition-all duration-300 ${
                pkg.popular ? "ring-2 ring-primary/20 scale-105" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <CardContent className="p-8 text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <pkg.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">{pkg.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{pkg.description}</p>

                {/* <div className="text-2xl font-bold text-primary mb-6">{pkg.price}</div> */}

                <ul className="space-y-3 mb-8 text-left">
                  {pkg.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
                  {/* Get Quote Button  */}
                {/* <div className="mt-auto">
                  <Link href="/contact">
                    <Button
                      className={`w-full ${
                        pkg.popular
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      }`}
                    >
                      Get Quote
                    </Button>
                  </Link>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need something different? We create custom packages for every celebration.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="bg-transparent">
              Create Custom Package
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

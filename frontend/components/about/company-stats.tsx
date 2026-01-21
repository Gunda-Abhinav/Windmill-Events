import { Calendar, Users, Award, Heart } from "lucide-react"

export function CompanyStats() {
  const stats = [
    {
      icon: Calendar,
      number: "40+",
      label: "Events Completed",
      description: "Successful celebrations across the Bay Area",
    },
    {
      icon: Users,
      number: "50+",
      label: "Happy Families",
      description: "Families who trusted us with their special moments",
    },
    {
      icon: Award,
      number: "8+",
      label: "Years Experience",
      description: "Creating unforgettable moments through experience",
    },
    {
      icon: Heart,
      number: "100%",
      label: "Satisfaction Rate",
      description: "Commitment to exceeding expectations every time",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Our Impact</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Numbers tell a story, but behind each statistic are real families, genuine emotions, and memories that last
            a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-10 h-10 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.number}</div>
              <div className="font-semibold text-foreground mb-2">{stat.label}</div>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

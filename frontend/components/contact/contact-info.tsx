import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Instagram } from "lucide-react"

export function ContactInfo() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      value: "(408) 922-9027",
      action: "tel:+11111111111", // TO ADD PHONE NUMBER
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "contact@windmill-events.com",
      action: "mailto:xxxxxxxxxx", // TO ADD EMAIL ADDRESS
    },
    // {
    //   icon: Instagram,
    //   title: "Follow Us",
    //   value: "@windmillevents",
    //   description: "See our latest work",
    //   action: "https://instagram.com/windmillevents",
    // },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Get In Touch</h3>
        <p className="text-muted-foreground">Ready to start planning? We're here to help bring your vision to life.</p>
      </div>

      <div className="grid gap-4">
        {contactMethods.map((method, index) => (
          <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <a
                href={method.action}
                className="flex items-start gap-3 group"
                target={method.action.startsWith("http") ? "_blank" : undefined}
                rel={method.action.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <method.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {method.title}
                  </h4>
                  <p className="text-foreground font-medium">{method.value}</p>
                  {/* <p className="text-sm text-muted-foreground">{method.description}</p> */}
                </div>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-secondary mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">Service Areas</h4>
              <p className="text-muted-foreground text-sm mb-3">
                We proudly serve events across the San Francisco Bay Area, Sacramento and beyond.
              </p>
              {/* <div className="flex flex-wrap gap-2">
                <Badge variant="outline">San Francisco Bay Area</Badge>
                <Badge variant="outline">Los Angeles</Badge>
                <Badge variant="outline">San Diego</Badge>
                <Badge variant="outline">Sacramento</Badge>
                <Badge variant="outline">Custom Locations</Badge>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

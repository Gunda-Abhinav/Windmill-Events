"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Linkedin } from "lucide-react"
import type { TeamMember } from "@/data/dummy-data"

interface TeamModalProps {
  member: TeamMember | null
  isOpen: boolean
  onClose: () => void
}

export function TeamModal({ member, isOpen, onClose }: TeamModalProps) {
  if (!member) return null

  // Extended bio and details for modal
  const extendedDetails = {
    "1": {
      fullBio:
        "Vikram founded Windmill  Events with a vision to bridge traditional Indian celebrations with modern American event planning. His journey began in Mumbai, where he grew up surrounded by vibrant festivals and family celebrations. After moving to the US for his MBA, he noticed a gap in authentic cultural event planning and decided to fill it. With over 18 years of experience, Vikram has personally overseen more than 300 weddings and cultural celebrations, each one reflecting his commitment to authenticity and excellence.",
      specialties: ["Traditional Ceremonies", "Cultural Consulting", "Event Strategy", "Vendor Relations"],
      achievements: ["50+ Events Planned", "Featured in Bay Area Wedding Magazine", "Cultural Heritage Award 2023"],
    },
    "2": {
      fullBio:
        "Anita brings military precision to event planning with her background in operations management. She joined Windmill Events three years ago and has since transformed our operational efficiency. Her attention to detail and ability to manage complex logistics makes even the most elaborate celebrations run seamlessly. Anita's passion for creating perfect moments shines through in every timeline she creates and every vendor she coordinates.",
      specialties: ["Operations Management", "Timeline Coordination", "Vendor Management", "Crisis Resolution"],
      achievements: ["Zero Event Delays Record", "Operations Excellence Award", "Client Satisfaction Champion"],
    },
    "3": {
      fullBio:
        "DJ Rohan discovered his love for music at age 12 when he started mixing Bollywood tracks with Western beats. His unique ability to read the crowd and create the perfect musical journey has made him one of the most sought-after DJs in the Bay Area. Rohan's expertise with professional audio equipment, combined with his vast knowledge of both traditional and contemporary music, ensures every celebration has the perfect soundtrack.",
      specialties: ["Professional Audio Setup", "Music Curation", "Live Mixing", "Cultural Music"],
      achievements: ["100+ Events DJ'd", "Bay Area's Best Cultural DJ 2022", "Professional Audio Certification"],
    },
    "4": {
      fullBio:
        "Kavya's artistic journey began with traditional Indian art forms, which she studied extensively before pursuing a degree in Interior Design. Her unique ability to blend traditional cultural elements with contemporary aesthetics has created some of the most stunning event spaces in the Bay Area. Every mandap, every centerpiece, and every decorative element reflects her deep understanding of cultural symbolism and modern design principles.",
      specialties: ["Traditional Decor", "Floral Design", "Cultural Styling", "Space Transformation"],
      achievements: [
        "Featured in Indian Wedding Magazine",
        "Best Decor Design Award 2023",
        "Cultural Arts Recognition",
      ],
    },
  }

  const details = extendedDetails[member.id as keyof typeof extendedDetails] || {
    fullBio: member.bioShort,
    specialties: [],
    achievements: [],
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">{member.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Photo */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
              <img src={member.photo || "/placeholder.svg"} alt={member.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-primary text-primary-foreground">{member.title}</Badge>
              <p className="text-muted-foreground leading-relaxed">{details.fullBio}</p>
            </div>

            {details.specialties.length > 0 && (
              <div>
                <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {details.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {details.achievements.length > 0 && (
              <div>
                <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Achievements</h3>
                <ul className="space-y-2">
                  {details.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Get in Touch</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {member.name.toLowerCase().replace(" ", ".")}@windmillevents.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">(408) 922-9027</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    linkedin.com/in/{member.name.toLowerCase().replace(" ", "")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

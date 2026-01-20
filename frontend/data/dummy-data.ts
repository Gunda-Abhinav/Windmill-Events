export interface Service {
  id: string
  title: string
  slug: string
  summary: string
  icon: string
  media: string[]
  //tags: string[]
  highlights: string[]
  isPremium: boolean
  price?: string
}

export interface Event {
  id: string
  title: string
  type: "wedding" | "cultural" | "corporate" | "birthday"
  date: string
  location: string
  pricePerPass?: number
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  media: string[]
}

export interface Testimonial {
  id: string
  name: string
  rating: number
  text: string
  media?: string
  eventType?: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  photo: string
  bioShort: string
}

export const services: Service[] = [
  {
    id: "1",
    title: "Event Hosting & Management",
    slug: "hosting-management",
    summary: "End-to-end event coordination with cultural authenticity and exceptional execution.",
    icon: "🎭",
    media: ["/event-manage.png"],
    //tags: ["Planning", "Coordination", "Cultural"],
    highlights: ["Full event timeline management", "Cultural ceremony coordination", "Vendor management"],
    isPremium: true,
    // price: "Starting at $XXX",
  },
  {
    id: "2",
    title: "Decor & Styling",
    slug: "decor-styling",
    summary: "Authentic cultural decor with modern elegance and traditional elements.",
    icon: "🌺",
    media: ["/decors.JPG"],
    //tags: ["Decor", "Styling", "Traditional"],
    highlights: ["Custom mandap designs", "Floral arrangements", "Lighting design"],
    isPremium: true,
    // price: "Starting at $XXXX",
  },
  {
    id: "3",
    title: "Professional DJ Setup",
    slug: "dj-setup",
    summary: "Bose L1 Pro32 arrays, T8 mixer, Shure SM58 wireless mics with laser lighting.",
    icon: "🎵",
    media: ["/dj-setup.png"],
    //tags: ["Music", "Audio", "Professional"],
    highlights: ["Bose L1 Pro32 sound system", "Wireless microphones", "Laser & disco lighting"],
    isPremium: false,
    // price: "Starting at $XXXX",
  },
  {
    id: "4",
    title: "Health-Forward Cocktails",
    slug: "cocktails-mocktails",
    summary: "Fresh fruit cocktails and mocktails with Vitamix blending and honey-only sweetening.",
    icon: "🍹",
    media: ["/fresh-fruit-cocktails-with-mint-and-honey.jpg"],
    //tags: ["Beverages", "Healthy", "Fresh"],
    highlights: ["Fresh fruit ingredients", "Honey-only sweetening", "Live cocktail crafting"],
    isPremium: false,
    // price: "Starting at $XXX",
  },
  {
    id: "5",
    title: "LED Dance Floor",
    slug: "dance-floor",
    summary: "Interactive LED dance floors that respond to music and create magical moments.",
    icon: "💃",
    media: ["/led-dance-floor-with-colorful-lights.jpg"],
    //tags: ["Dancing", "LED", "Interactive"],
    highlights: ["Music-responsive lighting", "Custom patterns", "Safe non-slip surface"],
    isPremium: true,
    // price: "Starting at $XXX",
  },
  {
    id: "6",
    title: "Cold Sparkles Effects",
    slug: "cold-sparkles",
    summary: "Safe cold sparkle effects for dramatic entrances and special moments.",
    icon: "✨",
    media: ["/cold-sparkles.png"],
    //tags: ["Effects", "Special", "Safe"],
    highlights: ["Safe cold sparkles", "Dramatic timing", "Photo-perfect moments"],
    isPremium: true,
    // price: "Starting at $XXX",
  },
  {
    id: "7",
    title: "Dancing on Cloud",
    slug: "dancing-cloud",
    summary: "Low-lying fog effects that create the illusion of dancing on clouds.",
    icon: "☁️",
    media: ["/dancing-on-cloud.png"],
    //tags: ["Effects", "Romantic", "Fog"],
    highlights: ["Low-lying fog machine", "Safe dry ice effects", "Romantic ambiance"],
    isPremium: true,  
    // price: "Starting at $XXXX",
  },
  {
    id: "8",
    title: "Photo & Video Production",
    slug: "photo-video",
    summary: "Professional photography and videography capturing every precious moment.",
    icon: "📸",
    media: ["/photography.png"],
    //tags: ["Photography", "Video", "Memories"],
    highlights: ["4K video recording", "Drone photography", "Same-day highlights"],
    isPremium: false,
    // price: "Starting at $XXXX",
  },
  {
    id: "9",
    title: "360° Photo Booth",
    slug: "360-booth",
    summary: "Interactive 360-degree photo booth for unique guest experiences.",
    icon: "📱",
    media: ["/360-photo.png"],
    //tags: ["Interactive", "Photos", "Entertainment"],
    highlights: ["360° video capture", "Instant social sharing", "Custom branding"],
    isPremium: false,
    // price: "Starting at $XXX",
  },
]


export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya & Arjun",
    rating: 5,
    text: "Handled everything perfectly from decor to DJ and timelines.",
    media: "/placeholder.svg?height=300&width=400",
    eventType: "",
  },
  {
    id: "2",
    name: "Radhika & Kiran",
    rating: 5,
    text: "Beautiful South Indian setup for our Griha Pravesh.",
    eventType: "Cultural Festival",
  },
  {
    id: "3",
    name: "Sanjay",
    rating: 5,
    text: "Corporate Diwali event was a hit.",
    eventType: "Corporate Event",
  }
]

// export const teamMembers: TeamMember[] = [
//   {
//     id: "1",
//     name: "Vikram Mehta",
//     title: "Founder & Creative Director",
//     photo: "/placeholder.svg?height=400&width=400",
//     bioShort:
//       "With 15+ years in event management, Vikram brings authentic cultural vision and modern execution to every celebration.",
//   }
// ]

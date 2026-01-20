import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8"> {/* same 32×32 as header */}
                <img
                  src="/windmillEventsLogo.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-serif text-lg font-bold">Windmill Events</span>
                <Sparkle size="sm" className="text-accent" />
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Exquisite cultural event experiences with authentic flair, health-forward cocktails, and professional-grade
              production.
            </p>

            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/windmill_for_events" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              {/* <Link href="" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Events
              </Link>
              <Link href="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Gallery
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link
                href="/testimonials"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">(408) 922-9027</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">contact@windmill-events.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">San Francisco Bay Area</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          {/* TO DO: link to Backend to generate emails. */}
          {/* <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">Get the latest event inspiration and exclusive offers.</p>
            <div className="space-y-2">
              <Input type="email" placeholder="Enter your email" className="bg-background" />
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button>
            </div>
          </div> */}
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Windmill Events. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Phone, Mail, Sparkles } from "lucide-react"
import { Sparkle } from "@/components/ui/sparkle"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-border/50 shadow-xl">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="flex justify-center space-x-2 mb-6">
              <Sparkle size="lg" className="text-accent animate-float" />
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <Sparkle size="lg" className="text-accent animate-float" style={{ animationDelay: "1s" }} />
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Create Magic?</h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Let's bring your vision to life with authentic cultural flair, exceptional quality, and unforgettable
              experiences. Your celebration deserves nothing less than extraordinary.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 hover:scale-105 transition-transform duration-200 text-primary-foreground px-8 py-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-secondary dark:border-white text-secondary hover:bg-secondary hover:text-secondary-foreground hover:scale-105 transition-transform duration-200 px-8 py-3 bg-transparent"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call (408) 922-9027
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-semibold text-sm text-foreground">Free Consultation</div>
                {/* <div className="text-xs text-muted-foreground">No obligation planning session</div> */}
              </div>
              <div className="text-center">
                <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-semibold text-sm text-foreground">24/7 Support</div>
                {/* <div className="text-xs text-muted-foreground">We're here when you need us</div> */}
              </div>
              <div className="text-center">
                <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-semibold text-sm text-foreground">Quick Response</div>
                {/* <div className="text-xs text-muted-foreground">Response within 2 hours</div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { MapEmbed } from "@/components/contact/map-embed"
import { CTASection } from "@/components/home/cta-section"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main>
        <ContactHero />

        <ScrollReveal>
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <ContactForm />
                </div>
                <div className="space-y-8">
                  <ContactInfo />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <MapEmbed />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}

import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { ServicesHero } from "@/components/services/services-hero"
import { ServicesGrid } from "@/components/services/services-grid"
import { PackageBanner } from "@/components/services/package-banner"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main>
        <ServicesHero />
        <ScrollReveal>
          <ServicesGrid />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <PackageBanner />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}

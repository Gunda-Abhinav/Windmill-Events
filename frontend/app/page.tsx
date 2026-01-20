import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { HeroVideo } from "@/components/home/hero-video"
import { ServicesRow } from "@/components/home/services-row"
import { WhyUs } from "@/components/home/why-us"
import { ReviewsCarousel } from "@/components/home/reviews-carousel"
import { InstagramReel } from "@/components/home/instagram-reel"
import { CTASection } from "@/components/home/cta-section"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <main>
        <HeroVideo />
        <ScrollReveal>
          <ServicesRow />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <WhyUs />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ReviewsCarousel />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <InstagramReel />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <CTASection />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}

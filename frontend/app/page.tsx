import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { HeroVideo } from "@/components/home/hero-video"
import { ScrollReveal } from "@/components/scroll-reveal"
import dynamic from "next/dynamic"

// Lazy load below-the-fold components
const ServicesRow = dynamic(() => import("@/components/home/services-row").then(mod => ({ default: mod.ServicesRow })), {
  loading: () => <div className="h-96 animate-pulse bg-muted/20" />
})
const WhyUs = dynamic(() => import("@/components/home/why-us").then(mod => ({ default: mod.WhyUs })), {
  loading: () => <div className="h-96 animate-pulse bg-muted/20" />
})
const ReviewsCarousel = dynamic(() => import("@/components/home/reviews-carousel").then(mod => ({ default: mod.ReviewsCarousel })), {
  loading: () => <div className="h-96 animate-pulse bg-muted/20" />
})
const InstagramReel = dynamic(() => import("@/components/home/instagram-reel").then(mod => ({ default: mod.InstagramReel })), {
  loading: () => <div className="h-96 animate-pulse bg-muted/20" />
})
const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="h-64 animate-pulse bg-muted/20" />
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <AnnouncementBar />
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

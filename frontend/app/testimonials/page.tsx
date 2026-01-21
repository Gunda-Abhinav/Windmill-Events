import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { TestimonialsHero } from "@/components/testimonials/testimonials-hero"
import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid"
import { VideoTestimonials } from "@/components/testimonials/video-testimonials"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <AnnouncementBar />
      <main>
        <TestimonialsHero />
        <ScrollReveal delay={0.1}>
          <TestimonialsGrid />
        </ScrollReveal>
        {/* <ScrollReveal delay={0.2}>
          <VideoTestimonials />
        </ScrollReveal> */}
      </main>
      <Footer />
    </div>
  )
}

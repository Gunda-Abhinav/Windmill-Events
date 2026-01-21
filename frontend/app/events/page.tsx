import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { EventsHero } from "@/components/events/events-hero"
import { EventsGallery } from "@/components/events/events-gallery"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <AnnouncementBar />
      <main>
        <EventsHero />
        <ScrollReveal>
          <EventsGallery />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}

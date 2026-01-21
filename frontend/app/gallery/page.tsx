import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { GalleryHero } from "@/components/gallery/gallery-hero"
import { MediaGrid } from "@/components/gallery/media-grid"
import { InstagramEmbed } from "@/components/gallery/instagram-embed"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <AnnouncementBar />
      <main>
        <GalleryHero />
        <ScrollReveal>
          <MediaGrid />
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <InstagramEmbed />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}

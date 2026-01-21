import { HeaderNav } from "@/components/header-nav"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { AboutHero } from "@/components/about/about-hero"
import { MissionBlock } from "@/components/about/mission-block"
import { TeamGrid } from "@/components/about/team-grid"
import { PromiseBanner } from "@/components/about/promise-banner"
import { CompanyStats } from "@/components/about/company-stats"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />
      <AnnouncementBar />
      <main>
        <AboutHero />
        <ScrollReveal>
          <MissionBlock />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <CompanyStats />
        </ScrollReveal>
        {/* <ScrollReveal delay={0.2}>
          <TeamGrid />
        </ScrollReveal> */}
        <ScrollReveal delay={0.1}>
          <PromiseBanner />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}

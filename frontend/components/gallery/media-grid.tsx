"use client"

import { useEffect } from "react"
import Script from "next/script"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

declare global {
  interface Window {
    // Instagram embed global provided by https://www.instagram.com/embed.js
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}

export function MediaGrid() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.instgrm && typeof window.instgrm.Embeds?.process === 'function') {
      try {
        window.instgrm.Embeds.process()
      } catch (e) {
      }
    }
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
        />

        {/* Recent Posts Grid (clean cards, no long caption) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "https://www.instagram.com/p/DOTYFb1jll-/",
            "https://www.instagram.com/p/DOWIqLCEb6E/",
            "https://www.instagram.com/p/DILOD_Kxu2E/",
            "https://www.instagram.com/p/DIMVoIfPvos/",
            "https://www.instagram.com/p/DKL_5b5xVDa/",
            "https://www.instagram.com/p/DQTF9dukVes/",
          ].map((permalink, i) => (
            <Card key={i} className="ig-card overflow-hidden rounded-xl border border-border bg-card/80 shadow-sm">
              {/* Media wrapper — pick a tile aspect ratio */}
              <div className="ig-embed-wrap aspect-[4/5] md:aspect-square rounded-xl">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={permalink}
                  data-instgrm-version="14"
                  style={{ margin: 0 }}
                />
              </div>

              {/* Custom footer only */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-border">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  @windmill_for_events
                </span>
                <Link href={permalink} target="_blank" rel="noopener noreferrer" className="text-primary">
                  View on Instagram
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <style jsx global>{`
          /* Normalize the embed container */
          .ig-card .instagram-media {
            width: 100% !important;
            max-width: 100% !important;
            border: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Wrapper: keeps rounded corners & hides any chrome we crop off */
          .ig-embed-wrap {
            position: relative;
            overflow: hidden;
            background: hsl(var(--muted));
            border-radius: 0.75rem;
          }

          /* Make the iframe behave like object-fit: cover */
          .ig-embed-wrap iframe {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(1.28) !important; /* tune this if needed */
            width: 115% !important;   /* slightly larger than wrapper so no letterboxing */
            height: 115% !important;
            border: 0 !important;
          }

          /* Remove any inner padding Instagram adds before content loads */
          .ig-embed-wrap .instagram-media > div { padding: 0 !important; }
        `}</style>


      </div>
    </section>
  )
}

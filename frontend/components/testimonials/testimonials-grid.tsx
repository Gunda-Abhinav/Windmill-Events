"use client"

import { useState } from "react"
import { testimonials } from "@/data/dummy-data"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"
import { TestimonialModal } from "@/components/testimonials/testimonial-modal"
import type { Testimonial } from "@/data/dummy-data"

export function TestimonialsGrid() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [filter, setFilter] = useState<"all" | "wedding" | "cultural" | "corporate" | "birthday">("all")

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (filter === "all") return true
    return testimonial.eventType?.toLowerCase().includes(filter)
  })

  const eventTypes = [
    { key: "all" as const, label: "All Reviews" },
    { key: "wedding" as const, label: "Weddings" },
    { key: "cultural" as const, label: "Cultural Events" },
    { key: "corporate" as const, label: "Corporate" },
    { key: "birthday" as const, label: "Birthdays" },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Client Testimonials</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Read what our clients have to say about their experience with Windmill Events.
          </p>
        </div>

        {/* Filter Tabs */}
        {/* <div className="flex flex-wrap justify-center gap-2 mb-12">
          {eventTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setFilter(type.key)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === type.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div> */}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onClick={() => setSelectedTestimonial(testimonial)}
            />
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No testimonials found for the selected category.</p>
          </div>
        )}

        <TestimonialModal
          testimonial={selectedTestimonial}
          isOpen={!!selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      </div>
    </section>
  )
}

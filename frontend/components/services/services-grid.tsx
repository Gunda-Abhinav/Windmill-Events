"use client"

import { useState } from "react"
import { services } from "@/data/dummy-data"
import { ServiceCard } from "@/components/services/service-card"
import { ServiceModal } from "@/components/services/service-modal"
import type { Service } from "@/data/dummy-data"

export function ServicesGrid() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [filter, setFilter] = useState<"all" | "premium" | "standard">("all")

  const filteredServices = services.filter((service) => {
    if (filter === "premium") return service.isPremium
    if (filter === "standard") return !service.isPremium
    return true
  })

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Services
            </button>
            {/* Filter Buttons */}
            {/* <button
              onClick={() => setFilter("premium")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "premium"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Premium
            </button>
            <button
              onClick={() => setFilter("standard")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "standard"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Standard
            </button> */}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
          ))}
        </div>

        {/* Service Modal */}
        <ServiceModal service={selectedService} isOpen={!!selectedService} onClose={() => setSelectedService(null)} />
      </div>
    </section>
  )
}

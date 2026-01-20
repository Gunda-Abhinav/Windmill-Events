"use client"

import { useState } from "react"
import { TeamCard } from "@/components/about/team-card"
import { TeamModal } from "@/components/about/team-modal"
import { teamMembers } from "@/data/dummy-data"
import type { TeamMember } from "@/data/dummy-data"

export function TeamGrid() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            The passionate individuals who bring your celebrations to life with expertise, creativity, and genuine care
            for every detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} onClick={() => setSelectedMember(member)} />
          ))}
        </div>

        <TeamModal member={selectedMember} isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} />
      </div>
    </section>
  )
}

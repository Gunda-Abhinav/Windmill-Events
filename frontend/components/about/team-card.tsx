"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { TeamMember } from "@/data/dummy-data"

interface TeamCardProps {
  member: TeamMember
  onClick: () => void
}

export function TeamCard({ member, onClick }: TeamCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden">
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10">
          <img
            src={member.photo || "/placeholder.svg"}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClick}
              className="text-white hover:text-white hover:bg-white/20 w-full"
            >
              Learn More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-6 text-center">
        <h3 className="font-serif text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {member.name}
        </h3>
        <p className="text-sm text-primary font-medium mb-3">{member.title}</p>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{member.bioShort}</p>
      </CardContent>
    </Card>
  )
}

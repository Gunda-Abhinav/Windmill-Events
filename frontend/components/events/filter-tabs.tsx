"use client"

import { Badge } from "@/components/ui/badge"

interface FilterTabsProps {
  currentFilter: "all" | "wedding" | "cultural" | "corporate" | "birthday"
  onFilterChange: (filter: "all" | "wedding" | "cultural" | "corporate" | "birthday") => void
}

export function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const filters = [
    { key: "all" as const, label: "All Events", count: 12 },
    { key: "wedding" as const, label: "Weddings", count: 6 },
    { key: "cultural" as const, label: "Cultural", count: 3 },
    { key: "corporate" as const, label: "Corporate", count: 2 },
    { key: "birthday" as const, label: "Birthdays", count: 1 },
  ]

  return null
  
  // return (
  //   <div className="flex flex-wrap justify-center gap-2 mb-12">
  //     {filters.map((filter) => (
  //       <button
  //         key={filter.key}
  //         onClick={() => onFilterChange(filter.key)}
  //         className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
  //           currentFilter === filter.key
  //             ? "bg-primary text-primary-foreground shadow-lg"
  //             : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
  //         }`}
  //       >
  //         <span>{filter.label}</span>
  //         <Badge
  //           variant="secondary"
  //           className={`ml-2 ${currentFilter === filter.key ? "bg-primary-foreground/20 text-primary-foreground" : ""}`}
  //         >
  //           {filter.count}
  //         </Badge>
  //       </button>
  //     ))}
  //   </div>
  // )
}

import type React from "react"
import { cn } from "@/lib/utils"

interface SparkleProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Sparkle({ className, size = "md", ...props }: SparkleProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  return (
    <div {...props} className={cn("inline-block animate-sparkle", sizeClasses[size], className)}>
      ✨
    </div>
  )
}

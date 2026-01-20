"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

export function AnimatedBackground() {
  const { theme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isDark
            ? [
                "radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(0, 0, 139, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 80%, rgba(184, 134, 11, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.15) 0%, transparent 50%)",
              ]
            : [
                "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 80%, rgba(234, 179, 8, 0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.08) 0%, transparent 50%)",
              ],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isDark
            ? [
                "radial-gradient(circle at 80% 20%, rgba(0, 0, 139, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 80%, rgba(184, 134, 11, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 20%, rgba(139, 0, 0, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(0, 0, 139, 0.1) 0%, transparent 50%)",
              ]
            : [
                "radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 80%, rgba(234, 179, 8, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 20%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)",
              ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}

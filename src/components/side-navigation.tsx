import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const sections = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
]

export function SideNavigation() {
  const [activeSection, setActiveSection] = useState("home")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
              setActiveSection(id)
            }
          })
        },
        {
          threshold: [0.3],
          rootMargin: "-10% 0px -10% 0px",
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-4">
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id
        const isHovered = hoveredSection === id

        return (
          <div
            key={id}
            className="flex items-center gap-3"
            onMouseEnter={() => setHoveredSection(id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Label tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm text-white/70 font-light"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot */}
            <motion.button
              onClick={() => scrollToSection(id)}
              className={`relative w-3 h-3 rounded-full border transition-colors duration-300 ${
                isActive
                  ? "bg-sky-400 border-sky-400"
                  : "bg-transparent border-white/30 hover:border-white/60"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Navigate to ${label}`}
            >
              {/* Glow effect for active dot */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-sky-400"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                    opacity: [0.5, 0.2, 0.5],
                    scale: [1, 1.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ filter: "blur(4px)" }}
                />
              )}
            </motion.button>
          </div>
        )
      })}
    </div>
  )
}

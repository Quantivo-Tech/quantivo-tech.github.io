import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  tiltEnabled?: boolean
  glowColor?: "blue" | "purple" | "teal"
}

export function GlassCard({
  children,
  className = "",
  tiltEnabled = true,
  glowColor = "blue"
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const rotateXValue = (mouseY / (rect.height / 2)) * -5
    const rotateYValue = (mouseX / (rect.width / 2)) * 5

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  const glowColors = {
    blue: "rgba(56, 189, 248, 0.2)",
    purple: "rgba(168, 85, 247, 0.2)",
    teal: "rgba(45, 212, 191, 0.2)",
  }

  const shadowColors = {
    blue: "0 0 30px rgba(56, 189, 248, 0.15), inset 0 0 30px rgba(56, 189, 248, 0.03)",
    purple: "0 0 30px rgba(168, 85, 247, 0.15), inset 0 0 30px rgba(168, 85, 247, 0.03)",
    teal: "0 0 30px rgba(45, 212, 191, 0.15), inset 0 0 30px rgba(45, 212, 191, 0.03)",
  }

  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "glass-card p-6 relative overflow-hidden transition-all duration-300",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
        boxShadow: isHovered ? shadowColors[glowColor] : "none",
        borderColor: isHovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        handleMouseLeave()
        setIsHovered(false)
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Inner glow effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColors[glowColor]}, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

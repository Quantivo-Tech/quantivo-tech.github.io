import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { ShaderText } from "./shader-text"
import { NetworkVisualization } from "./network-visualization"

type UserType = "brand" | "influencer"

interface HeroSectionProps {
  particleCanvasRef: React.RefObject<HTMLCanvasElement | null>
  onScrollToSection: (sectionId: string, userType?: UserType) => void
}

export function HeroSection({ particleCanvasRef, onScrollToSection }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useMotionValue(0)
  const [isHidden, setIsHidden] = useState(false)

  // Track scroll progress through the 150vh container (was 200vh - shortened for snappier feel)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateProgress = () => {
      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / (containerHeight - window.innerHeight)))
      scrollProgress.set(progress)

      // Set hidden state for a11y when hero is mostly faded
      setIsHidden(progress > 0.9)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [scrollProgress])

  // ============================================
  // IMMEDIATE VISUAL FEEDBACK - "10% Rule"
  // Hero starts reacting the MOMENT user scrolls
  // ============================================

  // Hero exit animations - NOW STARTS AT 10% (was 70%)
  // 0-10%: Full visibility (brief hold)
  // 10-80%: Gradual fade/scale (the "relay" zone)
  // 80-100%: Fully faded, Card 1 takes over
  const heroOpacity = useTransform(scrollProgress, [0, 0.1, 0.8], [1, 1, 0])

  // Y position: starts moving at 10%, reaches -15vh by end
  const heroY = useTransform(scrollProgress, [0, 0.1, 1], [0, 0, -15])

  // Scale: subtle shrink starts at 10% (1.0 → 0.98 early, 0.92 by end)
  const heroScale = useTransform(scrollProgress, [0, 0.1, 0.5, 1], [1, 1, 0.98, 0.92])

  // FIX 3: Scroll indicator dismisses IMMEDIATELY (0-10%)
  const scrollIndicatorOpacity = useTransform(scrollProgress, [0, 0.05, 0.15], [1, 1, 0])

  // FIX 2: Parallax offset for background (passed to canvas)
  const parallaxY = useTransform(scrollProgress, [0, 1], [0, -50])

  return (
    <div
      ref={containerRef}
      className="relative h-[150vh]"
    >
      {/* Sticky Hero Content */}
      <section
        id="home"
        className="sticky top-0 h-screen overflow-hidden"
        style={{ zIndex: 30 }}
      >
        {/* Dark gradient background - NO parallax to prevent gap at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1628] to-[#020617] z-0" />

        {/* Network visualization - with parallax for depth, MORE VISIBLE */}
        <motion.div
          className="absolute inset-0 z-[5]"
          style={{ y: useTransform(parallaxY, v => v * 0.5) }}
        >
          <NetworkVisualization
            opacity={0.45}
            speed={0.12}
            nodeCount={35}
            connectionDistance={130}
          />
        </motion.div>

        {/* Particle canvas - with subtle parallax */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{ y: useTransform(parallaxY, v => v * 0.3) }}
        >
          <canvas ref={particleCanvasRef} className="absolute inset-0" />
        </motion.div>

        {/* Animated Hero Content */}
        <motion.div
          className="relative z-20 h-full flex flex-col items-center justify-center p-4 will-change-transform"
          style={{
            opacity: heroOpacity,
            y: useTransform(heroY, (v) => `${v}vh`),
            scale: heroScale,
          }}
          aria-hidden={isHidden}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center space-y-8"
            style={{ pointerEvents: isHidden ? "none" : "auto" }}
          >
            {/* Shader text headline */}
            <div style={{ perspective: "1000px" }}>
              <ShaderText
                text="Where SaaS Brands, Meet Real Influence"
                className="h-48 md:h-64"
                style={{
                  width: "clamp(300px, 90vw, 800px)",
                  transform: "rotateX(15deg)",
                  transformStyle: "preserve-3d",
                }}
                config={{
                  amplitude: 0.02,
                  frequency: 8.0,
                  speed: 0.4,
                  decay: 1.8,
                }}
              />
              <h1 className="sr-only">Where SaaS Brands Meet Real Influence</h1>
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl font-light text-white/80 max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              The bridge between ambitious brands and influential business owners.
            </motion.p>

            {/* Dual CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-52 glass-strong hover:bg-white/20 text-white border-sky-400/50"
                  onClick={() => onScrollToSection("contact", "brand")}
                >
                  I'm a Brand
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-52 glass-strong hover:bg-white/20 text-white border-teal-400/50"
                  onClick={() => onScrollToSection("contact", "influencer")}
                >
                  I'm an Influencer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - fades out earlier */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-sm font-light mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

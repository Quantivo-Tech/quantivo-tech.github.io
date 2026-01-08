import { useRef, useEffect, useCallback, useState } from "react"
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { NetworkVisualization } from "./network-visualization"

const statements = [
  "We find the right voices.",
  "We handle the campaign.",
  "You get results.",
]

export function PinnedScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useMotionValue(0)
  const globalScrollProgress = useMotionValue(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateProgress = () => {
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionHeight = container.offsetHeight
      const scrollableDistance = sectionHeight - windowHeight
      const scrolledPast = -rect.top
      const progress = Math.max(0, Math.min(1, scrolledPast / scrollableDistance))
      scrollProgress.set(progress)

      // Global scroll for hero overlap zone
      const overlapProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight))
      globalScrollProgress.set(overlapProgress)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [scrollProgress, globalScrollProgress])

  return (
    <section
      ref={containerRef}
      className="relative h-[400vh]"
      style={{ marginTop: "-100vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1628] to-[#020617] z-0" />

        <NetworkVisualization
          className="z-[5]"
          opacity={0.06}
          speed={0.08}
          nodeCount={25}
          connectionDistance={100}
        />

        {/* Cards container - z-10 */}
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          {statements.map((statement, index) => (
            <StatementCard
              key={index}
              statement={statement}
              index={index}
              totalCards={statements.length}
              scrollProgress={scrollProgress}
              globalScrollProgress={globalScrollProgress}
            />
          ))}
        </div>

        {/* Glass shatter overlay - z-30 (ABOVE cards) - Only for Card 1 */}
        <GlassShatterOverlay scrollProgress={scrollProgress} globalScrollProgress={globalScrollProgress} />
      </div>
    </section>
  )
}

interface StatementCardProps {
  statement: string
  index: number
  totalCards: number
  scrollProgress: MotionValue<number>
  globalScrollProgress: MotionValue<number>
}

function StatementCard({ statement, index, totalCards, scrollProgress, globalScrollProgress }: StatementCardProps) {
  const isFirstCard = index === 0

  // FASTER timing - each card gets ~12% for enter, ~18% hold, ~12% exit
  // This makes transitions feel snappy (0.4-0.6s effective at normal scroll speed)
  const keyframes = [
    { enter: [0, 0.12], hold: [0.12, 0.30], exit: [0.30, 0.42] },
    { enter: [0.38, 0.50], hold: [0.50, 0.65], exit: [0.65, 0.77] },
    { enter: [0.73, 0.85], hold: [0.85, 0.95], exit: [0.95, 1.0] },
  ]

  const k = keyframes[index]

  // ============================================
  // CARD 1: Fade-in from blur (no y movement)
  // ============================================
  if (isFirstCard) {
    // Pre-appearance during hero exit
    const preOpacity = useTransform(globalScrollProgress, [0.3, 1], [0, 1])
    const preScale = useTransform(globalScrollProgress, [0.3, 1], [0.92, 1])
    const preBlur = useTransform(globalScrollProgress, [0.3, 1], [8, 0])

    // Exit: scale down + fade (falling into background)
    const exitProgress = useTransform(scrollProgress, [k.hold[1], k.exit[1]], [0, 1])
    const exitOpacity = useTransform(exitProgress, [0, 1], [1, 0])
    const exitScale = useTransform(exitProgress, [0, 1], [1, 0.85])
    const exitY = useTransform(exitProgress, [0, 1], [0, 30])

    // Combine pre-appearance and exit
    const opacity = useTransform(scrollProgress, (p) => {
      if (p < k.hold[1]) return preOpacity.get()
      return exitOpacity.get()
    })

    const scale = useTransform(scrollProgress, (p) => {
      if (p < k.hold[1]) return preScale.get()
      return exitScale.get()
    })

    const y = useTransform(scrollProgress, (p) => {
      if (p < k.hold[1]) return 0
      return exitY.get()
    })

    const filter = useTransform(scrollProgress, (p) => {
      if (p < k.enter[1]) {
        const blur = preBlur.get()
        return `blur(${blur}px)`
      }
      return "blur(0px)"
    })

    // Depth shadow grows as card approaches
    const shadow = useTransform(globalScrollProgress, [0.3, 1], [
      "0 10px 40px rgba(0,0,0,0.2)",
      "0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(56,189,248,0.1)"
    ])

    return (
      <motion.div
        className="absolute max-w-2xl w-full will-change-transform"
        style={{ opacity, scale, y, filter, boxShadow: shadow }}
      >
        <CardContent statement={statement} index={index} totalCards={totalCards} />
      </motion.div>
    )
  }

  // ============================================
  // CARDS 2 & 3: Stack & Push with Elastic Rebound
  // ============================================

  // Enter: slide up from bottom with overshoot (elastic)
  const enterProgress = useTransform(scrollProgress, [k.enter[0], k.enter[1]], [0, 1])

  // Custom elastic-out easing via transform
  const elasticOut = (t: number): number => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }

  // Entry Y: starts at 100px below, overshoots to -8px, settles at 0
  const entryY = useTransform(enterProgress, (p) => {
    const eased = elasticOut(p)
    return 100 * (1 - eased)
  })

  // Entry scale: 0.9 -> slight overshoot to 1.02 -> 1.0
  const entryScale = useTransform(enterProgress, (p) => {
    const eased = elasticOut(p)
    // Add subtle overshoot
    if (p > 0.7 && p < 0.9) {
      return 1 + (eased - 1) * 0.3 // Slight bounce
    }
    return 0.9 + 0.1 * eased
  })

  // Entry opacity
  const entryOpacity = useTransform(enterProgress, [0, 0.3], [0, 1])

  // Exit: scale down + fade (falling into background)
  const exitProgress = useTransform(scrollProgress, [k.hold[1], k.exit[1]], [0, 1])
  const exitOpacity = useTransform(exitProgress, [0, 1], [1, 0])
  const exitScale = useTransform(exitProgress, [0, 1], [1, 0.85])
  const exitY = useTransform(exitProgress, [0, 1], [0, 30])

  // Combine enter and exit
  const opacity = useTransform(scrollProgress, (p) => {
    if (p < k.enter[0]) return 0
    if (p < k.enter[1]) return entryOpacity.get()
    if (p < k.hold[1]) return 1
    return exitOpacity.get()
  })

  const scale = useTransform(scrollProgress, (p) => {
    if (p < k.enter[0]) return 0.9
    if (p < k.enter[1]) return entryScale.get()
    if (p < k.hold[1]) return 1
    return exitScale.get()
  })

  const y = useTransform(scrollProgress, (p) => {
    if (p < k.enter[0]) return 100
    if (p < k.enter[1]) return entryY.get()
    if (p < k.hold[1]) return 0
    return exitY.get()
  })

  // Depth shadow - grows during entry, shrinks during exit
  const shadow = useTransform(scrollProgress, (p) => {
    if (p < k.enter[0]) return "0 5px 20px rgba(0,0,0,0.1)"
    if (p < k.enter[1]) {
      const prog = enterProgress.get()
      const shadowSize = 10 + prog * 15
      const glowOpacity = prog * 0.1
      return `0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,${0.2 + prog * 0.2}), 0 0 40px rgba(56,189,248,${glowOpacity})`
    }
    if (p < k.hold[1]) {
      return "0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(56,189,248,0.1)"
    }
    const prog = exitProgress.get()
    const shadowSize = 25 - prog * 15
    return `0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,${0.4 - prog * 0.2})`
  })

  return (
    <motion.div
      className="absolute max-w-2xl w-full will-change-transform"
      style={{ opacity, scale, y, boxShadow: shadow }}
    >
      <CardContent statement={statement} index={index} totalCards={totalCards} />
    </motion.div>
  )
}

// Extracted card content for cleaner code
function CardContent({ statement, index, totalCards }: { statement: string; index: number; totalCards: number }) {
  return (
    <div className="glass-card p-10 md:p-14 text-center relative">
      <div className="text-6xl text-sky-400/20 font-serif leading-none mb-4">"</div>
      <p className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
        {statement}
      </p>
      <div className="flex justify-center gap-3 mt-8">
        {Array.from({ length: totalCards }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6),0_0_16px_rgba(56,189,248,0.3)]"
                : "bg-white/20 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// GLASS SHATTER - Only for Hero->Card1 transition
// Now with: Impact flash, motion blur, higher z-index
// ============================================

interface Shard {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  vertices: { x: number; y: number }[]
  opacity: number
  size: number // For variable sizes
  blur: number // Motion blur amount
}

interface CrackLine {
  points: { x: number; y: number }[]
}

interface GlassShatterOverlayProps {
  scrollProgress: MotionValue<number>
  globalScrollProgress: MotionValue<number>
}

function GlassShatterOverlay({ scrollProgress, globalScrollProgress }: GlassShatterOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shardsRef = useRef<Shard[]>([])
  const cracksRef = useRef<CrackLine[]>([])
  const [showFlash, setShowFlash] = useState(false)
  const phaseRef = useRef<"idle" | "cracking" | "shatter" | "done">("idle")
  const animationRef = useRef<number | null>(null)

  // Generate Voronoi-like cracks from center
  const generateCracks = useCallback((width: number, height: number) => {
    const cracks: CrackLine[] = []
    const centerX = width / 2
    const centerY = height / 2
    const numCracks = 12 // More cracks for detail

    for (let i = 0; i < numCracks; i++) {
      const angle = (i / numCracks) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
      const points: { x: number; y: number }[] = [{ x: centerX, y: centerY }]

      let x = centerX
      let y = centerY
      const segments = 5 + Math.floor(Math.random() * 4)

      for (let j = 0; j < segments; j++) {
        const dist = 25 + Math.random() * 40
        const angleVariation = (Math.random() - 0.5) * 0.6
        x += Math.cos(angle + angleVariation) * dist
        y += Math.sin(angle + angleVariation) * dist
        points.push({ x, y })

        // Branch for complexity
        if (Math.random() > 0.5 && j < segments - 1) {
          const branchAngle = angle + (Math.random() > 0.5 ? 0.6 : -0.6)
          const branchPoints: { x: number; y: number }[] = [{ x, y }]
          let bx = x, by = y
          for (let k = 0; k < 2; k++) {
            const bd = 15 + Math.random() * 25
            bx += Math.cos(branchAngle) * bd
            by += Math.sin(branchAngle) * bd
            branchPoints.push({ x: bx, y: by })
          }
          cracks.push({ points: branchPoints })
        }
      }
      cracks.push({ points })
    }
    return cracks
  }, [])

  // Generate shards with variable sizes and motion blur prep
  const generateShards = useCallback((width: number, height: number) => {
    const shards: Shard[] = []
    const numShards = 35 // More shards
    const centerX = width / 2
    const centerY = height / 2

    for (let i = 0; i < numShards; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * Math.min(width, height) * 0.35
      const x = centerX + Math.cos(angle) * dist
      const y = centerY + Math.sin(angle) * dist

      // HIGH velocity for impactful feel
      const speed = 400 + Math.random() * 600
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed - 100 // Initial upward bias

      // Variable shard sizes (Voronoi-like)
      const size = 10 + Math.random() * 35
      const vertices = generateShardVertices(size)

      shards.push({
        x, y, vx, vy,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 15,
        vertices,
        opacity: 1,
        size,
        blur: 0,
      })
    }
    return shards
  }, [])

  // Generate irregular polygon vertices (more glass-like)
  const generateShardVertices = (size: number) => {
    const numVertices = 3 + Math.floor(Math.random() * 3) // 3-5 vertices
    const vertices: { x: number; y: number }[] = []
    for (let i = 0; i < numVertices; i++) {
      const angle = (i / numVertices) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const r = size * (0.5 + Math.random() * 0.5)
      vertices.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      })
    }
    return vertices
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }

    updateCanvasSize()

    const render = () => {
      const globalProg = globalScrollProgress.get()
      const localProg = scrollProgress.get()
      const { width, height } = canvas

      ctx.clearRect(0, 0, width, height)

      // Only run during hero->card1 transition (global 0.3 to 1.0)
      // AND before card1's hold phase ends (local < 0.30)
      const isActive = globalProg > 0.3 && globalProg < 1.0 && localProg < 0.15

      if (!isActive) {
        if (phaseRef.current !== "idle") {
          phaseRef.current = "idle"
          cracksRef.current = []
          shardsRef.current = []
        }
        animationRef.current = requestAnimationFrame(render)
        return
      }

      // Progress within the shatter zone (0.3 to 1.0 of global)
      const shatterZoneProgress = (globalProg - 0.3) / 0.7

      // Phase 1: Cracking (0-50% of shatter zone)
      if (shatterZoneProgress < 0.5) {
        if (phaseRef.current === "idle") {
          cracksRef.current = generateCracks(width, height)
          phaseRef.current = "cracking"
        }

        // Glass overlay
        ctx.fillStyle = "rgba(255, 255, 255, 0.06)"
        ctx.fillRect(0, 0, width, height)

        // Draw cracks with glow
        const crackProgress = shatterZoneProgress / 0.5
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
        ctx.lineWidth = 1.5
        ctx.shadowColor = "rgba(56, 189, 248, 0.6)"
        ctx.shadowBlur = 6

        cracksRef.current.forEach((crack, i) => {
          const delay = i * 0.03
          const localProg = Math.max(0, Math.min(1, (crackProgress - delay) / (1 - delay)))

          if (localProg > 0) {
            ctx.beginPath()
            ctx.moveTo(crack.points[0].x, crack.points[0].y)

            const pointsToShow = Math.ceil(localProg * (crack.points.length - 1))
            for (let j = 1; j <= pointsToShow; j++) {
              if (j === pointsToShow && localProg < 1) {
                const prev = crack.points[j - 1]
                const next = crack.points[j]
                const t = (localProg * (crack.points.length - 1)) % 1
                ctx.lineTo(prev.x + (next.x - prev.x) * t, prev.y + (next.y - prev.y) * t)
              } else {
                ctx.lineTo(crack.points[j].x, crack.points[j].y)
              }
            }
            ctx.stroke()
          }
        })
        ctx.shadowBlur = 0
      }
      // Phase 2: Shatter (50-100% of shatter zone)
      else {
        if (phaseRef.current === "cracking") {
          shardsRef.current = generateShards(width, height)
          phaseRef.current = "shatter"
          // Trigger flash
          setShowFlash(true)
          setTimeout(() => setShowFlash(false), 100)
        }

        const shatterProgress = (shatterZoneProgress - 0.5) / 0.5
        const dt = 0.018

        shardsRef.current.forEach((shard) => {
          // Physics with high gravity for weight
          shard.x += shard.vx * dt
          shard.y += shard.vy * dt
          shard.vy += 800 * dt // Strong gravity
          shard.vx *= 0.99 // Air resistance
          shard.rotation += shard.rotationSpeed * dt
          shard.opacity = Math.max(0, 1 - shatterProgress * 2)

          // Motion blur based on velocity
          const speed = Math.sqrt(shard.vx * shard.vx + shard.vy * shard.vy)
          shard.blur = Math.min(speed * 0.008, 4)

          if (shard.opacity > 0) {
            ctx.save()
            ctx.translate(shard.x, shard.y)
            ctx.rotate(shard.rotation)
            ctx.globalAlpha = shard.opacity

            // Apply motion blur via shadow
            if (shard.blur > 0.5) {
              const blurAngle = Math.atan2(shard.vy, shard.vx)
              ctx.shadowColor = "rgba(255, 255, 255, 0.3)"
              ctx.shadowBlur = shard.blur
              ctx.shadowOffsetX = Math.cos(blurAngle) * shard.blur * 2
              ctx.shadowOffsetY = Math.sin(blurAngle) * shard.blur * 2
            }

            // Draw shard
            ctx.beginPath()
            ctx.moveTo(shard.vertices[0].x, shard.vertices[0].y)
            shard.vertices.forEach((v) => ctx.lineTo(v.x, v.y))
            ctx.closePath()

            // Glass gradient fill
            const gradient = ctx.createLinearGradient(-shard.size, -shard.size, shard.size, shard.size)
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)")
            gradient.addColorStop(0.4, "rgba(56, 189, 248, 0.35)")
            gradient.addColorStop(1, "rgba(255, 255, 255, 0.25)")
            ctx.fillStyle = gradient
            ctx.fill()

            // Edge highlight
            ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
            ctx.lineWidth = 0.5
            ctx.shadowBlur = 0
            ctx.stroke()

            ctx.restore()
          }
        })
      }

      animationRef.current = requestAnimationFrame(render)
    }

    animationRef.current = requestAnimationFrame(render)
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [scrollProgress, globalScrollProgress, generateCracks, generateShards])

  return (
    <>
      {/* Impact flash */}
      <div
        className={`absolute inset-0 z-40 pointer-events-none transition-opacity duration-100 ${
          showFlash ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)",
        }}
      />
      {/* Canvas - z-30 to stay ABOVE cards (z-10) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-30"
      />
    </>
  )
}

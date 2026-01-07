import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { NetworkVisualization } from "./network-visualization"

const statements = [
  "We find the right voices.",
  "We handle the campaign.",
  "You get results.",
]

export function PinnedScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh]"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

        {/* Network visualization - very subtle */}
        <NetworkVisualization
          className="z-5"
          opacity={0.06}
          speed={0.08}
          nodeCount={25}
          connectionDistance={100}
        />

        {/* Content container */}
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          {statements.map((statement, index) => (
            <StatementCard
              key={index}
              statement={statement}
              index={index}
              totalCards={statements.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface StatementCardProps {
  statement: string
  index: number
  totalCards: number
  scrollProgress: import("framer-motion").MotionValue<number>
}

function StatementCard({ statement, index, totalCards, scrollProgress }: StatementCardProps) {
  // Calculate the scroll range for this card
  const segmentSize = 1 / totalCards
  const start = index * segmentSize
  const mid = start + segmentSize * 0.5
  const end = (index + 1) * segmentSize

  // Card enters from start to mid, exits from mid to end
  const opacity = useTransform(
    scrollProgress,
    [start, start + segmentSize * 0.15, mid - segmentSize * 0.1, mid + segmentSize * 0.1, end - segmentSize * 0.15, end],
    [0, 1, 1, 1, 1, 0]
  )

  const scale = useTransform(
    scrollProgress,
    [start, start + segmentSize * 0.2, mid, end - segmentSize * 0.2, end],
    [0.85, 1, 1, 1, 0.85]
  )

  const y = useTransform(
    scrollProgress,
    [start, start + segmentSize * 0.2, mid, end - segmentSize * 0.2, end],
    [40, 0, 0, 0, -40]
  )

  return (
    <motion.div
      className="absolute max-w-2xl w-full"
      style={{ opacity, scale, y }}
    >
      <div className="glass-card p-10 md:p-14 text-center">
        {/* Decorative quote mark */}
        <div className="text-6xl text-sky-400/20 font-serif leading-none mb-4">"</div>

        {/* Statement text */}
        <p className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
          {statement}
        </p>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalCards }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === index ? "bg-sky-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

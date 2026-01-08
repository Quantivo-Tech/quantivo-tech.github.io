import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { useRef } from "react"
import { MessageSquare, Search, Rocket } from "lucide-react"
import { GlassCard } from "./ui/glass-card"

const steps = [
  {
    icon: MessageSquare,
    title: "Tell Us Your Goals",
    description: "Share what you're looking for - whether you're a brand seeking reach or an influencer ready to partner.",
  },
  {
    icon: Search,
    title: "We Find the Perfect Match",
    description: "Our team handpicks partners based on audience fit, values, and goals. No algorithms - real curation.",
  },
  {
    icon: Rocket,
    title: "Launch & Grow",
    description: "We handle the campaign end-to-end. You get results, reports, and a lasting partnership.",
  },
]

// Circle positions as percentages of the container height
const circlePositions = [0.15, 0.5, 0.85]

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "end 0.4"],
  })

  // Map scroll progress to line height (0% to 100%)
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Determine active step based on scroll progress
  const activeStep = useTransform(scrollYProgress, (progress) => {
    if (progress < 0.25) return 0
    if (progress < 0.6) return 1
    return 2
  })

  // Line tip position for the "plasma dot"
  const tipPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div ref={containerRef} className="relative">
      {/* SVG Path for the vertical line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: '4px' }}>
        {/* Background track */}
        <div className="absolute inset-0 bg-white/10 rounded-full" />

        {/* Animated gradient line using SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <motion.line
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            stroke="url(#lineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              pathLength,
            }}
          />
        </svg>

        {/* Plasma tip - glowing dot at the leading edge */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
          style={{
            top: tipPosition,
            background: "radial-gradient(circle, rgba(56,189,248,1) 0%, rgba(56,189,248,0.5) 50%, transparent 100%)",
            boxShadow: "0 0 20px rgba(56,189,248,0.8), 0 0 40px rgba(56,189,248,0.4)",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-12 md:space-y-24">
        {steps.map((step, index) => (
          <StepItem
            key={step.title}
            step={step}
            index={index}
            activeStep={activeStep}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  )
}

type StepState = "completed" | "active" | "inactive"

interface StepItemProps {
  step: typeof steps[0]
  index: number
  activeStep: MotionValue<0 | 1 | 2>
  scrollYProgress: MotionValue<number>
}

function StepItem({ step, index, activeStep, scrollYProgress }: StepItemProps) {
  // Determine circle state based on active step
  const circleState = useTransform(activeStep, (active): StepState => {
    if (index < active) return "completed"
    if (index === active) return "active"
    return "inactive"
  })

  // Card spotlight effect
  const cardOpacity = useTransform(activeStep, (active) => {
    if (index === active) return 1
    return 0.4
  })

  const cardGrayscale = useTransform(activeStep, (active) => {
    if (index === active) return 0
    return 1
  })

  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-8 ${
        index % 2 === 1 ? "md:flex-row-reverse" : ""
      }`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      {/* Step circle */}
      <div className="hidden md:flex w-1/2 justify-center">
        <StepCircle index={index} state={circleState} />
      </div>

      {/* Content card with spotlight effect */}
      <motion.div
        className="w-full md:w-1/2"
        style={{
          opacity: cardOpacity,
          filter: useTransform(cardGrayscale, (g) => `grayscale(${g})`),
        }}
      >
        <GlassCard
          className={`max-w-md mx-auto md:mx-0 transition-shadow duration-300`}
          glowColor={index === 2 ? "purple" : "blue"}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              <step.icon className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white mb-2">{step.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

interface StepCircleProps {
  index: number
  state: MotionValue<StepState>
}

function StepCircle({ index, state }: StepCircleProps) {
  // Circle fill animation
  const backgroundColor = useTransform(state, (s) => {
    if (s === "inactive") return "rgba(255, 255, 255, 0.1)"
    return "transparent" // Gradient will be applied via className
  })

  const borderColor = useTransform(state, (s) => {
    if (s === "inactive") return "rgba(255, 255, 255, 0.2)"
    return "transparent"
  })

  const textColor = useTransform(state, (s) => {
    if (s === "inactive") return "rgba(255, 255, 255, 0.4)"
    return "rgba(255, 255, 255, 1)"
  })

  const showGlow = useTransform(state, (s) => s === "active")
  const showGradient = useTransform(state, (s) => s !== "inactive")

  return (
    <motion.div
      className="relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light"
      style={{
        backgroundColor,
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor,
        color: textColor,
      }}
    >
      {/* Gradient background for active/completed */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-purple-500"
        style={{
          opacity: useTransform(showGradient, (show) => show ? 1 : 0),
        }}
      />

      {/* Pulsing glow for active state - using CSS animation */}
      <motion.div
        className="absolute inset-0 rounded-full animate-pulse-glow"
        style={{
          opacity: useTransform(showGlow, (show) => show ? 1 : 0),
        }}
      />

      {/* Number */}
      <span className="relative z-10">{index + 1}</span>
    </motion.div>
  )
}

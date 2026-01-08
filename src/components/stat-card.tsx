import { motion, useAnimation } from "framer-motion"
import { useCountUp } from "../hooks/useCountUp"
import { useEffect } from "react"

interface StatCardProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  description?: string
  delay?: number
}

export function StatCard({ value, suffix = "", prefix = "", label, description, delay = 0 }: StatCardProps) {
  const numberControls = useAnimation()

  const { count, ref, isComplete } = useCountUp({
    end: value,
    suffix,
    prefix,
    duration: 1500,
    onComplete: () => {
      // Trigger the "pop" and bloom effect when count finishes
      numberControls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 }
      })
    }
  })

  return (
    <motion.div
      ref={ref}
      className="glass-card p-6 text-center"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8
      }}
      aria-live={isComplete ? "polite" : "off"}
    >
      <motion.div
        className="text-4xl md:text-5xl font-light text-white mb-2"
        animate={numberControls}
        style={{
          textShadow: isComplete
            ? "0 0 20px rgba(56, 189, 248, 0.4)"
            : "0 0 15px rgba(56, 189, 248, 0.2)"
        }}
      >
        {count}
      </motion.div>
      <div className="text-sm text-white/60">{label}</div>
      {description && <div className="text-xs text-white/40 mt-1">{description}</div>}
    </motion.div>
  )
}

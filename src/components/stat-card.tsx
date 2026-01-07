import { motion } from "framer-motion"
import { useCountUp } from "../hooks/useCountUp"

interface StatCardProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  delay?: number
}

export function StatCard({ value, suffix = "", prefix = "", label, delay = 0 }: StatCardProps) {
  const { count, ref } = useCountUp({
    end: value,
    suffix,
    prefix,
    duration: 2000,
  })

  return (
    <motion.div
      ref={ref}
      className="glass-card p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="text-4xl md:text-5xl font-light text-white mb-2"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        {count}
      </motion.div>
      <div className="text-sm text-white/60">{label}</div>
    </motion.div>
  )
}

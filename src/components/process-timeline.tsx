import { motion, useScroll, useTransform } from "framer-motion"
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

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div ref={containerRef} className="relative">
      {/* Vertical line for desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2">
        <motion.div
          className="w-full bg-gradient-to-b from-sky-400 to-purple-500"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-12 md:space-y-24">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            {/* Step number */}
            <div className="hidden md:flex w-1/2 justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-2xl font-light text-white">
                {index + 1}
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2">
              <GlassCard className="max-w-md mx-auto md:mx-0" glowColor={index === 2 ? "purple" : "blue"}>
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
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

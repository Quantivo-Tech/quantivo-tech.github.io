import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { NetworkVisualization } from "./network-visualization"

export type UserType = "brand" | "influencer"

interface ContactSectionProps {
  userType: UserType
  setUserType: (type: UserType) => void
}

export function ContactSection({ userType, setUserType }: ContactSectionProps) {

  return (
    <section id="contact" className="relative py-20 cursor-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0a1628] to-[#0a0f1a] z-0" />
      <NetworkVisualization className="z-[5]" opacity={0.06} speed={0.08} nodeCount={15} connectionDistance={90} />

      {/* Ambient glow that changes with toggle */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
        animate={{
          background: userType === "brand"
            ? "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.h2
          className="section-header text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Let's Work Together
        </motion.h2>
        <motion.p
          className="text-white/60 text-center mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Tell us who you are, and we'll show you what's possible.
        </motion.p>

        {/* Toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="glass-card inline-flex p-1 sm:p-1.5 rounded-full relative">
            {/* Sliding pill background */}
            <motion.div
              className="absolute top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 rounded-full"
              layoutId="toggle-pill"
              animate={{
                left: userType === "brand" ? "4px" : "50%",
                right: userType === "brand" ? "50%" : "4px",
                background: userType === "brand"
                  ? "linear-gradient(to right, #38bdf8, #2563eb)"
                  : "linear-gradient(to right, #2dd4bf, #14b8a6)",
                boxShadow: userType === "brand"
                  ? "0 0 20px rgba(56,189,248,0.4)"
                  : "0 0 20px rgba(45,212,191,0.4)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            <motion.button
              className={`relative z-10 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                userType === "brand" ? "text-white" : "text-white/60 hover:text-white"
              }`}
              onClick={() => setUserType("brand")}
              whileTap={{ scale: 0.95 }}
            >
              I'm a Brand
            </motion.button>
            <motion.button
              className={`relative z-10 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                userType === "influencer" ? "text-white" : "text-white/60 hover:text-white"
              }`}
              onClick={() => setUserType("influencer")}
              whileTap={{ scale: 0.95 }}
            >
              I'm an Influencer
            </motion.button>
          </div>
        </motion.div>

        {/* Form container with min-height to prevent jumping */}
        <div className="max-w-xl mx-auto" style={{ minHeight: "480px" }}>
          <AnimatePresence mode="wait">
            {userType === "brand" ? (
              <motion.div
                key="brand-form"
                initial={{ opacity: 0, x: 30, rotateY: 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -30, rotateY: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card gradient-border p-5 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl font-light text-white mb-2">Ready to Reach New Audiences?</h3>
                  <p className="text-white/50 text-xs sm:text-sm mb-4 sm:mb-6">Tell us about your brand and goals. We'll show you what's possible.</p>
                  <form className="space-y-4">
                    <Input
                      placeholder="Company Name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-sky-400/50 focus:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-shadow"
                    />
                    <Input
                      placeholder="Your Name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-sky-400/50 focus:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-shadow"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-sky-400/50 focus:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-shadow"
                    />
                    <Textarea
                      placeholder="What are you looking for?"
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-sky-400/50 focus:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-shadow resize-none"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] transition-shadow"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="influencer-form"
                initial={{ opacity: 0, x: 30, rotateY: 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -30, rotateY: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card gradient-border-teal p-5 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl font-light text-white mb-2">Ready to Land Brand Deals?</h3>
                  <p className="text-white/50 text-xs sm:text-sm mb-4 sm:mb-6">Tell us about your audience. We'll match you with the right opportunities.</p>
                  <form className="space-y-4">
                    <Input
                      placeholder="Your Name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-teal-400/50 focus:shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-shadow"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-teal-400/50 focus:shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-shadow"
                    />
                    <Input
                      placeholder="Social Profile Link"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-teal-400/50 focus:shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-shadow"
                    />
                    <Textarea
                      placeholder="Tell us about your audience"
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-teal-400/50 focus:shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-shadow resize-none"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:shadow-[0_0_40px_rgba(45,212,191,0.5)] transition-shadow"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

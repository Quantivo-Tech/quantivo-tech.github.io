import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCursor } from "./hooks/useCursor"
import { useScrollSections } from "./hooks/useScrollSections"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { ShaderText } from "./components/shader-text"
import { NetworkVisualization } from "./components/network-visualization"
import { GlassCard } from "./components/ui/glass-card"
import { StatCard } from "./components/stat-card"
import { ProcessTimeline } from "./components/process-timeline"
import {
  ArrowRight,
  Users,
  Globe,
  Cpu,
  Home,
  Briefcase,
  User,
  MessageCircle,
  Target,
  Handshake,
  TrendingUp,
  FileCheck,
  BarChart3,
  DollarSign,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react"

// --- 1. Configurable Props for Particle Effect ---
// Exposed props for easy tuning of the particle field.
const particleConfig = {
  particleCount: 60,
  driftSpeed: 2,
  parallaxFactor: 0.05,
  damping: 0.08,
  color: "rgba(56, 189, 248, 0.4)",
  sizeRange: [1, 4],
}

export default function App() {
  // --- 2. Refs for Particle Canvas and Animation ---
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  // Using a ref to store particles prevents re-renders on animation frames.
  const particlesRef = useRef<any[]>([])
  // --- New: Ref to hold the latest mouse position without causing re-renders ---
  const mousePosRef = useRef({ x: 0, y: 0 })

  // Use optimized hooks
  const { mousePosition, springGlowX, springGlowY } = useCursor()
  const { activeSection, showFloatingNav } = useScrollSections()

  // --- New: Update the mouse position ref when the hook provides a new value ---
  useEffect(() => {
    mousePosRef.current = mousePosition
  }, [mousePosition])

  // --- 3. Particle Animation Logic ---
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    // --- New: Variables to store the smoothed parallax offset ---
    let parallaxOffsetX = 0
    let parallaxOffsetY = 0

    // Function to set canvas size
    const setCanvasSize = () => {
      const { width, height } = canvas.parentElement!.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    // Function to initialize particles
    const initParticles = () => {
      const { width, height } = canvas
      const speed = particleConfig.driftSpeed / 60 // Convert px/sec to px/frame
      particlesRef.current = []
      for (let i = 0; i < particleConfig.particleCount; i++) {
        const radius =
          Math.random() * (particleConfig.sizeRange[1] - particleConfig.sizeRange[0]) +
          particleConfig.sizeRange[0]
        const angle = Math.random() * 2 * Math.PI
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        })
      }
    }

    // --- 5. Performance: Batch draws in a single animation loop ---
    const render = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // --- 6. Performance: Read mouse position from the ref ---
      const mouseX = mousePosRef.current.x
      const mouseY = mousePosRef.current.y

      // --- New: Calculate a *target* offset and smoothly interpolate towards it ---
      const targetParallaxX = (mouseX - width / 2) * particleConfig.parallaxFactor
      const targetParallaxY = (mouseY - height / 2) * particleConfig.parallaxFactor

      // The smoothing/damping creates the "barely follow" effect
      parallaxOffsetX += (targetParallaxX - parallaxOffsetX) * particleConfig.damping
      parallaxOffsetY += (targetParallaxY - parallaxOffsetY) * particleConfig.damping

      ctx.fillStyle = particleConfig.color

      particlesRef.current.forEach((p) => {
        // Update position with drift
        p.x += p.vx
        p.y += p.vy

        // Wrap particles around edges
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Draw particle with the new *smoothed* parallax offset
        ctx.beginPath()
        ctx.arc(p.x + parallaxOffsetX, p.y + parallaxOffsetY, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    const handleResize = () => {
      setCanvasSize()
      initParticles()
    }

    // Initial setup
    setCanvasSize()
    initParticles()
    render()

    // Event listener for resize
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, []) // --- Performance Fix: Empty dependency array ensures this effect runs only ONCE ---

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] overflow-x-hidden cursor-none">
      {/* Custom Cursor */}
      <div
        className="fixed w-6 h-6 border-2 border-white/50 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          backgroundColor: "transparent",
        }}
      />

      {/* Cursor Glow Effect with Physics - Only in Hero Section */}
      {activeSection === "home" && (
        <motion.div
          className="fixed pointer-events-none z-40"
          style={{
            left: springGlowX,
            top: springGlowY,
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0.08) 30%, rgba(56,189,248,0.03) 60%, transparent 100%)",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Floating Navigation - appears on scroll */}
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            className="fixed top-6 right-6 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-strong backdrop-blur-md rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg border border-white/10">
              <div className="flex items-center space-x-3 sm:space-x-6">
                {[
                  { id: "home", icon: Home, label: "Home" },
                  { id: "services", icon: Briefcase, label: "Services" },
                  { id: "about", icon: User, label: "About" },
                  { id: "contact", icon: MessageCircle, label: "Contact" },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      activeSection === item.id
                        ? "bg-sky-500 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={item.label}
                  >
                    <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Logo - Fixed position */}
      <motion.div
        className="fixed top-4 sm:top-6 left-4 sm:left-6 z-40 flex items-center space-x-2 sm:space-x-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
          <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <span className="text-lg sm:text-xl font-medium text-white drop-shadow-lg">QuantivoTech</span>
      </motion.div>

      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

        {/* Network visualization - connections between brands and influencers */}
        <NetworkVisualization className="z-5" opacity={0.15} speed={0.12} nodeCount={35} connectionDistance={120} />

        {/* Particle canvas */}
        <canvas ref={particleCanvasRef} className="absolute inset-0 z-10" />

        {/* Centered Content Wrapper */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center space-y-8"
          >
            {/* Shader text headline */}
            <div style={{ perspective: '1000px' }}>
              <ShaderText
                text="Where SaaS Brands, Meet Real Influence"
                className="h-48 md:h-64"
                style={{
                  width: 'clamp(300px, 90vw, 800px)',
                  transform: 'rotateX(15deg)',
                  transformStyle: 'preserve-3d',
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
                  onClick={() => scrollToSection('contact')}
                >
                  I'm a Brand
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="w-52 glass-strong hover:bg-white/20 text-white border-teal-400/50"
                  onClick={() => scrollToSection('contact')}
                >
                  I'm an Influencer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
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

      {/* Trust Bar + Value Split Section */}
      <section id="services" className="relative py-20 cursor-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Trust Bar */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-white/40 text-sm uppercase tracking-widest mb-8">
              Trusted by forward-thinking brands
            </p>
            <div className="glass-card p-6 inline-block">
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    className="w-24 h-8 bg-white/10 rounded opacity-40 hover:opacity-100 transition-opacity"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.4, scale: 1 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Value Split Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard className="gradient-border" glowColor="blue">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400/20 to-blue-600/20 flex items-center justify-center">
                  <Target className="w-7 h-7 text-sky-400" />
                </div>
                <h3 className="text-2xl font-light text-white">Scale Your Reach</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: Users, text: "Access vetted business influencers" },
                  { icon: FileCheck, text: "Full campaign management" },
                  { icon: BarChart3, text: "Transparent reporting & ROI tracking" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-white/70">
                    <item.icon className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="gradient-border-teal" glowColor="teal">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400/20 to-green-600/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-2xl font-light text-white">Monetize Your Audience</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: Handshake, text: "Get matched with relevant brands" },
                  { icon: DollarSign, text: "Fair, transparent deals" },
                  { icon: ShieldCheck, text: "We handle the business side" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-white/70">
                    <item.icon className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Why QuantivoTech Section */}
      <section id="about" className="relative py-20 cursor-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />
        <NetworkVisualization className="z-5" opacity={0.08} speed={0.1} nodeCount={20} connectionDistance={100} />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-light text-white text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why QuantivoTech
          </motion.h2>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GlassCard glowColor="blue">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-10 h-10 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-white mb-3">Built for B2B Influence</h3>
                    <p className="text-white/60 leading-relaxed">
                      We specialize in one thing: connecting SaaS brands with business owners who have real audiences.
                      No lifestyle fluff - just authentic voices your buyers trust.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GlassCard glowColor="purple">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="w-10 h-10 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-white mb-3">Boutique, Not Factory</h3>
                    <p className="text-white/60 leading-relaxed">
                      No account managers juggling 50 clients. You get hands-on partnership,
                      direct communication, and a team that actually knows your brand.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results / Social Proof Section */}
      <section className="relative py-20 cursor-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            <StatCard value={500} suffix="+" label="Influencer Partners" delay={0} />
            <StatCard value={98} suffix="%" label="Client Satisfaction" delay={0.1} />
            <StatCard value={10} suffix="x" label="Average Campaign ROI" delay={0.2} />
            <StatCard value={24} suffix="hr" label="Response Time" delay={0.3} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassCard className="max-w-3xl mx-auto text-center" glowColor="purple">
              <div className="text-4xl text-white/20 mb-4">"</div>
              <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-6">
                QuantivoTech found us the perfect partners - business owners whose audiences actually convert.
                Best agency decision we've made.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-purple-500" />
                <div className="text-left">
                  <div className="text-white font-medium">Marketing Director</div>
                  <div className="text-white/40 text-sm">SaaS Company</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 cursor-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-light text-white text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>

          <ProcessTimeline />
        </div>
      </section>

      {/* Dual CTA / Contact Section */}
      <section id="contact" className="relative py-20 cursor-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />
        <NetworkVisualization className="z-5" opacity={0.06} speed={0.08} nodeCount={15} connectionDistance={90} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-light text-white text-center mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Let's Work Together
          </motion.h2>
          <motion.p
            className="text-white/60 text-center mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Whether you're a brand looking to expand your reach or an influencer ready to monetize your audience, we're here to help.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="glass-card gradient-border p-8">
                <h3 className="text-2xl font-light text-white mb-2">Ready to Reach New Audiences?</h3>
                <p className="text-white/50 text-sm mb-6">Tell us about your brand and goals. We'll show you what's possible.</p>
                <form className="space-y-4">
                  <Input placeholder="Company Name" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-sky-400/50" />
                  <Input placeholder="Your Name" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-sky-400/50" />
                  <Input type="email" placeholder="Email" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-sky-400/50" />
                  <Textarea placeholder="What are you looking for?" rows={4} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-sky-400/50 resize-none" />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-card gradient-border-teal p-8">
                <h3 className="text-2xl font-light text-white mb-2">Ready to Land Brand Deals?</h3>
                <p className="text-white/50 text-sm mb-6">Tell us about your audience. We'll match you with the right opportunities.</p>
                <form className="space-y-4">
                  <Input placeholder="Your Name" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-400/50" />
                  <Input type="email" placeholder="Email" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-400/50" />
                  <Input placeholder="Social Profile Link" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-400/50" />
                  <Textarea placeholder="Tell us about your audience" rows={4} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-400/50 resize-none" />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-400 hover:to-green-500 text-white">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 cursor-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] to-[#050810] z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center md:text-left mb-12">
            <div className="md:col-span-1 flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-white">QuantivoTech</span>
              </div>
              <p className="text-white/40 text-sm font-light">Connecting brands with influential voices.</p>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-medium text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li className="hover:text-white/70 transition-colors cursor-pointer">For Brands</li>
                <li className="hover:text-white/70 transition-colors cursor-pointer">For Influencers</li>
                <li className="hover:text-white/70 transition-colors cursor-pointer">How It Works</li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-medium text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li className="hover:text-white/70 transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white/70 transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-white/70 transition-colors cursor-pointer">Privacy Policy</li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-medium text-white mb-4">Connect</h4>
              <p className="text-sm text-white/40 mb-4">hello@quantivotech.com</p>
              <div className="flex justify-center md:justify-start gap-3">
                {['LinkedIn', 'Twitter', 'Instagram'].map((social) => (
                  <motion.div
                    key={social}
                    className="w-10 h-10 glass rounded-full flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-white/60 text-xs">{social[0]}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-white/30">© 2025 QuantivoTech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

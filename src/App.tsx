import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCursor } from "./hooks/useCursor"
import { useScrollSections } from "./hooks/useScrollSections"
import { Button } from "./components/ui/button"
import { ShaderText } from "./components/shader-text"
import { NetworkVisualization } from "./components/network-visualization"
import { GlassCard } from "./components/ui/glass-card"
import { StatCard } from "./components/stat-card"
import { ProcessTimeline } from "./components/process-timeline"
import { ContactSection, type UserType } from "./components/contact-section"
import { PinnedScrollSection } from "./components/pinned-scroll-section"
import { HeroSection } from "./components/hero-section"
import { ScrollProgressBar } from "./components/scroll-progress-bar"
import { SideNavigation } from "./components/side-navigation"
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
  particleCount: 0,
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

  // Contact form user type state (lifted for hero CTA connection)
  const [contactUserType, setContactUserType] = useState<UserType>("brand")

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

  const scrollToSection = (sectionId: string, userType?: UserType) => {
    // Set user type if provided (for hero CTA -> contact form connection)
    if (userType) {
      setContactUserType(userType)
    }
    // Special case: "home" scrolls to absolute top
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#020617] overflow-x-clip cursor-none">
      {/* Progress Indicators */}
      <ScrollProgressBar />
      <SideNavigation />

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

      {/* Hero Section with scroll-driven exit */}
      <HeroSection
        particleCanvasRef={particleCanvasRef}
        onScrollToSection={scrollToSection}
      />

      {/* Pinned Scroll - Value Props (overlaps with Hero via negative margin) */}
      <PinnedScrollSection />

      {/* Trust Bar + Value Split Section - overlaps with pinned scroll */}
      <section id="services" className="relative pt-[60vh] pb-20 cursor-none" style={{ marginTop: "-50vh" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1628]/80 to-[#0a0f1a] z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Trust Bar */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-10%" }}
          >
            <p className="text-white/40 text-sm uppercase tracking-widest mb-8">
              Trusted by forward-thinking brands
            </p>
            <div className="glass-card p-6 inline-block">
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {/* Abstract tech company icons */}
                {[
                  // Hexagon with dot
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="20" cy="20" r="4" fill="currentColor"/>
                  </svg>,
                  // Stacked bars
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <rect x="6" y="24" width="28" height="4" rx="1" fill="currentColor"/>
                    <rect x="10" y="18" width="20" height="4" rx="1" fill="currentColor" opacity="0.7"/>
                    <rect x="14" y="12" width="12" height="4" rx="1" fill="currentColor" opacity="0.4"/>
                  </svg>,
                  // Connected nodes
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <circle cx="20" cy="10" r="4" fill="currentColor"/>
                    <circle cx="10" cy="30" r="4" fill="currentColor"/>
                    <circle cx="30" cy="30" r="4" fill="currentColor"/>
                    <line x1="20" y1="14" x2="12" y2="26" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="20" y1="14" x2="28" y2="26" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="14" y1="30" x2="26" y2="30" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>,
                  // Abstract S curve
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <path d="M10 10C10 10 30 10 30 20C30 30 10 30 10 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>,
                  // Grid squares
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <rect x="8" y="8" width="10" height="10" rx="2" fill="currentColor"/>
                    <rect x="22" y="8" width="10" height="10" rx="2" fill="currentColor" opacity="0.6"/>
                    <rect x="8" y="22" width="10" height="10" rx="2" fill="currentColor" opacity="0.6"/>
                    <rect x="22" y="22" width="10" height="10" rx="2" fill="currentColor" opacity="0.3"/>
                  </svg>,
                  // Circle with arc
                  <svg viewBox="0 0 40 40" className="w-10 h-10">
                    <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 8A12 12 0 0 1 32 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  </svg>,
                ].map((icon, i) => (
                  <motion.div
                    key={i}
                    className="text-white/30 hover:text-sky-400/80 transition-colors duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {icon}
                  </motion.div>
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0a1628] to-[#0a0f1a] z-0" />
        <NetworkVisualization className="z-5" opacity={0.08} speed={0.1} nodeCount={20} connectionDistance={100} />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h2
            className="section-header text-center mb-16"
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
                    <h3 className="text-3xl font-semibold tracking-tight text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Built for B2B Influence</h3>
                    <p className="text-lg leading-relaxed text-slate-400">
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
                    <h3 className="text-3xl font-semibold tracking-tight text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Boutique, Not Factory</h3>
                    <p className="text-lg leading-relaxed text-slate-400">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0a1628] to-[#0a0f1a] z-0" />

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
            <GlassCard className="max-w-3xl mx-auto text-center px-8 md:px-16 py-12" glowColor="purple">
              {/* Decorative quote mark */}
              <motion.div
                className="text-6xl text-sky-400/10 font-serif leading-none mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                "
              </motion.div>

              {/* Main quote with pull quote highlight */}
              <motion.p
                className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] mb-8"
                style={{ letterSpacing: '-0.03em' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                viewport={{ once: true }}
              >
                QuantivoTech found us the perfect partners - business owners whose audiences actually convert.{' '}
                <span className="bg-gradient-to-r from-sky-500/15 to-transparent px-2 py-1 rounded-sm text-sky-400 font-medium">
                  Best agency decision we've made.
                </span>
              </motion.p>

              {/* Attribution with abstract logo */}
              <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Abstract company logo */}
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 text-slate-400">
                    <rect x="4" y="4" width="10" height="10" rx="2" fill="currentColor" />
                    <rect x="18" y="4" width="10" height="10" rx="2" fill="currentColor" opacity="0.6" />
                    <rect x="4" y="18" width="10" height="10" rx="2" fill="currentColor" opacity="0.6" />
                    <rect x="18" y="18" width="10" height="10" rx="2" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Sarah Chen</div>
                  <div className="text-slate-500 text-sm tracking-wide uppercase">Marketing Director, TechCorp</div>
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 cursor-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0a1628] to-[#0a0f1a] z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.h2
            className="section-header text-center mb-16"
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
      <ContactSection userType={contactUserType} setUserType={setContactUserType} />

      {/* Footer */}
      <footer className="relative py-12 cursor-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] to-[#010409] z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center md:text-left mb-12">
            <div className="md:col-span-1 flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-medium text-white">QuantivoTech</span>
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
            <p className="text-sm text-white/30">© 2023 QuantivoTech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

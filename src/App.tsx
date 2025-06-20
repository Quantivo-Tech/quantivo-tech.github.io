import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useCursor } from "./hooks/useCursor"
import { useScrollSections } from "./hooks/useScrollSections"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Badge } from "./components/ui/badge"
import { ShaderText } from "./components/shader-text"
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
  CheckCircle,
  Code,
  Smartphone,
  Brain,
  ArrowRight,
  Calendar,
  Zap,
  Users,
  Globe,
  Cpu,
  Volume2,
  VolumeX,
  Home,
  Briefcase,
  User,
  MessageCircle,
} from "lucide-react"

// --- 1. Configurable Props for Particle Effect ---
// Exposed props for easy tuning of the particle field.
const particleConfig = {
  particleCount:50,
  driftSpeed: 3, // Pixels per second
  parallaxFactor: 0.05,
  damping: 0.1, // A value between 0-1 for smoothing. Higher is less smooth.
  color: "rgba(30, 98, 146, 0.9)", // Accent blue with some transparency
  sizeRange: [2, 5], // Min and max particle diameter in pixels
}

export default function App() {
  const { scrollYProgress } = useScroll()
  const servicesRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  // --- 2. Refs for Particle Canvas and Animation ---
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  // Using a ref to store particles prevents re-renders on animation frames.
  const particlesRef = useRef<any[]>([])
  // --- New: Ref to hold the latest mouse position without causing re-renders ---
  const mousePosRef = useRef({ x: 0, y: 0 })

  // Use optimized hooks
  const { mousePosition, springGlowX, springGlowY } = useCursor()
  const { activeSection, showFloatingNav } = useScrollSections()

  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"])

  // Create a separate scroll progress tracker for the services section
  const { scrollYProgress: servicesScrollProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"],
  })

  // Transform the vertical scroll into horizontal movement
  const imagesX = useTransform(
    servicesScrollProgress,
    [0.34, 0.54],
    ["0%", "-200%"], // Move from 0% to -75% (showing all images)
  )
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

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom web applications built with cutting-edge technologies.",
      features: ["React & Next.js", "Full-stack solutions", "Responsive design"],
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications.",
      features: ["iOS & Android", "React Native", "Flutter development"],
    },
    {
      icon: Brain,
      title: "AI Solutions",
      description: "Intelligent automation and machine learning integration.",
      features: ["Machine learning", "Data analytics", "Process automation"],
    },
  ]

  // Images for the horizontal scroll gallery
  const galleryImages = [
    {
      url: "/slides/1.jpg",
      alt: "Modern web application development",
    },
    {
      url: "/slides/2.png",
      alt: "Mobile app design and development",
    },
    {
      url: "/slides/3.jpg",
      alt: "Artificial intelligence and machine learning",
    },
    {
      url: "/slides/4.jpg",
      alt: "Cloud computing and infrastructure",
    },
    {
      url: "/slides/5.jpg",
      alt: "Advanced data analytics and visualization",
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden cursor-none">
      {/* Custom Cursor */}
      <div
        className="fixed w-6 h-6 border-2 border-black rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out"
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
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.03) 60%, transparent 100%)",
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
            <div className="bg-white/90 backdrop-blur-md rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg border border-gray-200">
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
                        : "text-gray-600 hover:text-sky-500 hover:bg-sky-50"
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
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg">
          <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <span className="text-lg sm:text-xl font-medium text-white drop-shadow-lg">QuantivoTech</span>
      </motion.div>

      {/* Hero Section with Darker Background */}
      <section id="home" ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background with darker overlay */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('/1920x911/2.png')`,
            }}
          >
            <div className="absolute inset-0 bg-black/0" />
          </div>
          {/* --- 4. Canvas Overlay for Particles --- */}
          <canvas ref={particleCanvasRef} className="absolute inset-0 z-10" />
        </motion.div>

        {/* Centered Content Wrapper */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center p-4">
          
          {/* Animated Content Group */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center space-y-8"
          >
            {/* Perspective container for 3D effect */}
            <div style={{ perspective: '1000px' }}>
              <ShaderText
                text="Your Vision, Our Innovation"
                className="h-48 md:h-64"
                style={{
                  width: 'clamp(300px, 90vw, 800px)',
                  transform: 'translateX(-1rem) rotateX(30deg)',
                  transformStyle: 'preserve-3d',
                }}
                config={{
                  amplitude: 0.02,
                  frequency: 8.0,
                  speed: 0.4,
                  decay: 1.8,
                }}
              />
              <h1 className="sr-only">Your Vision, Our Innovation</h1>
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl font-light opacity-90 max-w-3xl text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Transforming businesses through cutting-edge technology
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="w-44 bg-sky-500 hover:bg-sky-600 text-white">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="w-44 border-white text-white hover:bg-white hover:text-black bg-transparent">
                  <Globe className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator - Centered and straight */}
        <motion.div
          className="absolute bottom-8 left-1/2 text-white z-20"
          style={{
            transform: 'translateX(-50%)',
            transformStyle: 'flat',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="flex flex-col items-center"
            style={{
              transform: 'none',
              transformStyle: 'flat',
            }}
          >
            <span className="text-sm font-light mb-2 text-center">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-white rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section with Horizontal Scroll Gallery */}
      <section id="services" ref={servicesRef} className="py-20 bg-white cursor-none">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4 text-center">Our Services</h2>
            <p className="text-lg text-gray-600 font-light text-center max-w-2xl mx-auto">
              Comprehensive technology solutions for modern businesses
            </p>
          </motion.div>

          {/* Horizontal Scrolling Image Gallery - Centered */}
          <div className="relative w-full overflow-hidden mb-16">
            <motion.div className="flex space-x-4" style={{ x: imagesX }}>
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative flex-shrink-0 w-[80vw] max-w-2xl h-[50vh] rounded-lg overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img src={image.url || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <p className="text-white text-lg font-light text-center w-full">{image.alt}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator - Centered (Optimized) */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex space-x-2">
                {galleryImages.map((_, index) => {
                  const progress = servicesScrollProgress.get()
                  // const isActive = progress > index / galleryImages.length
                  const isActive = progress > 0.5

                  return (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        isActive ? "bg-sky-500" : "bg-gray-300"
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Service cards - Centered grid */}
          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="w-full max-w-sm"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-100">
                  <CardHeader className="text-center">
                    <motion.div
                      className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <service.icon className="w-6 h-6 text-sky-500" />
                    </motion.div>
                    <CardTitle className="text-lg font-medium text-gray-900 text-center">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600 font-light text-center">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center justify-center text-gray-700 text-sm">
                          <CheckCircle className="w-4 h-4 text-sky-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-stone-50 cursor-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h2 className="text-4xl font-light text-gray-900 mb-6">Why Choose QuantivoTech?</h2>
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                6+ years of experience delivering innovative technology solutions. Our expert team combines technical
                excellence with strategic thinking to drive your business forward.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "Secure & Reliable" },
                  { icon: Zap, title: "Fast Delivery" },
                  { icon: Award, title: "Quality Assured" },
                  { icon: Users, title: "Expert Team" },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="flex items-center justify-center lg:justify-start space-x-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-sky-500" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-end"
            >
              <div className="bg-sky-500 rounded-xl p-8 text-white text-center max-w-sm w-full">
                <h3 className="text-2xl font-light mb-4">Free Consultation</h3>
                <p className="mb-6 font-light opacity-90">
                  Get a comprehensive technology assessment and strategic roadmap at no cost.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-light">6+</div>
                    <div className="text-xs opacity-75">Years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light">100+</div>
                    <div className="text-xs opacity-75">Projects</div>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-white text-sky-500 hover:bg-gray-50">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white cursor-none">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4 text-center">Let's Build Something Amazing</h2>
            <p className="text-lg text-gray-600 font-light text-center max-w-2xl mx-auto">
              Ready to transform your business with technology?
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input type="email" placeholder="Email" className="border-gray-200" />
                <Input placeholder="Company" className="border-gray-200" />
                <select className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>AI & Machine Learning</option>
                  <option>Cloud Solutions</option>
                  <option>Consulting</option>
                  <option>Other</option>
                </select>
                <Textarea placeholder="Tell us about your project..." rows={4} className="border-gray-200" />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex justify-center">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white px-8">
                    Send Message
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                // { icon: Phone, title: "Phone", info: "+1 (555) 123-TECH", subinfo: "Mon-Fri 9AM-6PM PST" },
                {
                  icon: Mail,
                  title: "Email",
                  info: "contact@quantivotech.com",
                  subinfo: "We'll respond within 24 hours",
                },
                // {
                //   icon: MapPin,
                //   title: "Office",
                //   info: "Canada/U.S.A",
                //   subinfo: "Remote Teams",
                // },
              ].map((contact) => (
                <motion.div
                  key={contact.title}
                  className="flex items-start space-x-4 p-4 bg-stone-50 rounded-lg"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <contact.icon className="w-5 h-5 text-sky-500" />
                  </div>
                  <div className="text-center flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{contact.title}</h4>
                    <p className="text-sky-500 font-medium">{contact.info}</p>
                    <p className="text-xs text-gray-600">{contact.subinfo}</p>
                  </div>
                </motion.div>
              ))}

              <div className="bg-sky-500 text-white p-6 rounded-lg text-center">
                <h4 className="font-medium mb-2">Rapid Prototyping</h4>
                <p className="text-sm font-light opacity-90 mb-3">
                  Need a quick proof of concept? We can build and deploy prototypes in days, not weeks.
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-white text-sky-500 text-xs">
                    48-hour turnaround
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 cursor-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="md:col-span-1 flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">QuantivoTech</span>
      </div>
              <p className="text-gray-400 text-sm font-light mb-4 text-center md:text-left">
                Innovative technology solutions since 2018. Trusted by startups and enterprises.
        </p>
      </div>

            <div className="text-center md:text-left">
              <h4 className="font-medium mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Web Development</li>
                <li>Mobile Apps</li>
                <li>AI Solutions</li>
                <li>Cloud Infrastructure</li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>LinkedIn</li>
                <li>GitHub</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2024 QuantivoTech. All rights reserved. Innovating the future, one project at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

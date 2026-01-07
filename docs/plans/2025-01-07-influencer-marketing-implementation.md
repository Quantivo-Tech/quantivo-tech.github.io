# QuantivoTech Influencer Marketing Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform QuantivoTech from a tech services site to an influencer marketing agency website with 3D elements, glassmorphism, and unified dark flow.

**Architecture:** Single-page React app with modular section components. Three.js for 3D floating shapes. Framer Motion for scroll animations. Glassmorphic UI components throughout. Dark gradient background flowing continuously.

**Tech Stack:** React 19, TypeScript, Vite, Three.js, Framer Motion, Tailwind CSS, Radix UI

---

## Task 1: Update Dark Theme Foundation

**Files:**
- Modify: `src/index.css`

**Step 1: Update CSS variables for dark influencer theme**

Replace the entire `:root` block and add new glassmorphism utilities:

```css
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 6%;
    --foreground: 210 40% 98%;
    --card: 222 47% 8%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 8%;
    --popover-foreground: 210 40% 98%;
    --primary: 199 89% 48%;
    --primary-foreground: 222 47% 6%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 280 70% 60%;
    --accent-foreground: 210 40% 98%;
    --accent-brand: 170 70% 45%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 20%;
    --input: 217 33% 17%;
    --ring: 199 89% 48%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: "Raleway", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  }
}

/* Glassmorphism utilities */
@layer utilities {
  .glass {
    @apply bg-white/5 backdrop-blur-xl border border-white/10;
  }
  .glass-strong {
    @apply bg-white/10 backdrop-blur-2xl border border-white/20;
  }
  .glass-card {
    @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl;
  }
  .gradient-border {
    position: relative;
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.5), rgba(168, 85, 247, 0.5));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  .gradient-border-teal::before {
    background: linear-gradient(135deg, rgba(45, 212, 191, 0.5), rgba(34, 197, 94, 0.5));
  }
}

/* Custom cursor styles */
.cursor-none {
  cursor: none;
}
```

**Step 2: Verify the CSS compiles**

Run: `npm run build`
Expected: Build succeeds with no CSS errors

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: update theme to dark mode with glassmorphism utilities"
```

---

## Task 2: Create Floating 3D Shapes Component

**Files:**
- Create: `src/components/floating-shapes.tsx`

**Step 1: Create the Three.js floating shapes component**

```tsx
import { useEffect, useRef } from "react"
import * as THREE from "three"

interface FloatingShapesProps {
  className?: string
  opacity?: number
  speed?: number
  count?: number
}

export function FloatingShapes({
  className = "",
  opacity = 0.15,
  speed = 0.5,
  count = 8
}: FloatingShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    shapes: THREE.Mesh[]
    animationId: number | null
    mouse: { x: number; y: number }
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Create shapes
    const shapes: THREE.Mesh[] = []
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TorusGeometry(1, 0.4, 8, 16),
      new THREE.SphereGeometry(1, 16, 16),
    ]

    const material = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: opacity,
    })

    for (let i = 0; i < count; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const mesh = new THREE.Mesh(geometry.clone(), material.clone())

      mesh.position.x = (Math.random() - 0.5) * 50
      mesh.position.y = (Math.random() - 0.5) * 30
      mesh.position.z = (Math.random() - 0.5) * 20

      const scale = 0.5 + Math.random() * 2
      mesh.scale.set(scale, scale, scale)

      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01 * speed,
          y: (Math.random() - 0.5) * 0.01 * speed,
          z: (Math.random() - 0.5) * 0.01 * speed,
        },
        floatSpeed: Math.random() * 0.5 + 0.5,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: mesh.position.y,
      }

      shapes.push(mesh)
      scene.add(mesh)
    }

    sceneRef.current = {
      scene,
      camera,
      renderer,
      shapes,
      animationId: null,
      mouse: { x: 0, y: 0 },
    }

    // Animation
    let time = 0
    const animate = () => {
      if (!sceneRef.current) return
      time += 0.016

      sceneRef.current.shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotationSpeed.x
        shape.rotation.y += shape.userData.rotationSpeed.y
        shape.rotation.z += shape.userData.rotationSpeed.z

        shape.position.y = shape.userData.originalY +
          Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 2
      })

      // Subtle parallax on mouse
      const targetX = sceneRef.current.mouse.x * 2
      const targetY = sceneRef.current.mouse.y * 2
      camera.position.x += (targetX - camera.position.x) * 0.02
      camera.position.y += (targetY - camera.position.y) * 0.02
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      sceneRef.current.animationId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return
      sceneRef.current.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      sceneRef.current.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }

    // Resize handler
    const handleResize = () => {
      if (!sceneRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      sceneRef.current.camera.aspect = rect.width / rect.height
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(rect.width, rect.height)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [opacity, speed, count])

  return <div ref={containerRef} className={`absolute inset-0 ${className}`} />
}
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/floating-shapes.tsx
git commit -m "feat: add Three.js floating shapes component"
```

---

## Task 3: Create Glass Card Component

**Files:**
- Create: `src/components/ui/glass-card.tsx`

**Step 1: Create the glass card component with 3D tilt effect**

```tsx
import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  tiltEnabled?: boolean
  glowColor?: "blue" | "purple" | "teal"
}

export function GlassCard({
  children,
  className = "",
  tiltEnabled = true,
  glowColor = "blue"
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const rotateXValue = (mouseY / (rect.height / 2)) * -5
    const rotateYValue = (mouseX / (rect.width / 2)) * 5

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  const glowColors = {
    blue: "rgba(56, 189, 248, 0.15)",
    purple: "rgba(168, 85, 247, 0.15)",
    teal: "rgba(45, 212, 191, 0.15)",
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "glass-card p-6 relative overflow-hidden",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColors[glowColor]}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/ui/glass-card.tsx
git commit -m "feat: add glassmorphic card component with 3D tilt"
```

---

## Task 4: Create Count-Up Animation Hook

**Files:**
- Create: `src/hooks/useCountUp.ts`

**Step 1: Create the count-up animation hook**

```tsx
import { useState, useEffect, useRef } from "react"

interface UseCountUpOptions {
  end: number
  duration?: number
  start?: number
  decimals?: number
  suffix?: string
  prefix?: string
}

export function useCountUp({
  end,
  duration = 2000,
  start = 0,
  decimals = 0,
  suffix = "",
  prefix = "",
}: UseCountUpOptions) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true)
          hasAnimated.current = true
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    let animationId: number

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Ease out quad
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = start + (end - start) * easeOut

      setCount(currentCount)

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [isVisible, end, duration, start])

  const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`

  return { count: formattedCount, ref }
}
```

**Step 2: Verify hook compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/hooks/useCountUp.ts
git commit -m "feat: add count-up animation hook for stats"
```

---

## Task 5: Create Stat Card Component

**Files:**
- Create: `src/components/stat-card.tsx`

**Step 1: Create the stat card with count-up animation**

```tsx
import { motion } from "framer-motion"
import { useCountUp } from "@/hooks/useCountUp"

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
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/stat-card.tsx
git commit -m "feat: add stat card component with count-up animation"
```

---

## Task 6: Create Process Timeline Component

**Files:**
- Create: `src/components/process-timeline.tsx`

**Step 1: Create the 3-step timeline with drawing line animation**

```tsx
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
```

**Step 2: Verify component compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/process-timeline.tsx
git commit -m "feat: add process timeline component with scroll animation"
```

---

## Task 7: Update Particle Config for Dark Theme

**Files:**
- Modify: `src/App.tsx` (lines 36-44)

**Step 1: Update particle configuration for dark theme**

Find this block:
```tsx
const particleConfig = {
  particleCount:50,
  driftSpeed: 3, // Pixels per second
  parallaxFactor: 0.05,
  damping: 0.1, // A value between 0-1 for smoothing. Higher is less smooth.
  color: "rgba(30, 98, 146, 0.9)", // Accent blue with some transparency
  sizeRange: [2, 5], // Min and max particle diameter in pixels
}
```

Replace with:
```tsx
const particleConfig = {
  particleCount: 60,
  driftSpeed: 2,
  parallaxFactor: 0.05,
  damping: 0.08,
  color: "rgba(56, 189, 248, 0.4)",
  sizeRange: [1, 4],
}
```

**Step 2: Verify change compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update particle config for dark theme"
```

---

## Task 8: Rebuild Hero Section

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add new imports at the top of App.tsx**

Add after existing imports:
```tsx
import { FloatingShapes } from "./components/floating-shapes"
import { GlassCard } from "./components/ui/glass-card"
```

**Step 2: Replace hero section content**

Find the hero section (id="home") and replace the entire section with:

```tsx
{/* Hero Section */}
<section id="home" ref={heroRef} className="relative h-screen overflow-hidden">
  {/* Dark gradient background */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

  {/* Floating 3D shapes */}
  <FloatingShapes className="z-5" opacity={0.1} speed={0.3} count={10} />

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
```

**Step 3: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: rebuild hero section with dark theme and dual CTAs"
```

---

## Task 9: Create Trust Bar and Value Split Section

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add imports for new icons**

Add to lucide-react imports:
```tsx
import {
  // ... existing imports
  Target,
  Handshake,
  TrendingUp,
  FileCheck,
  BarChart3,
  DollarSign,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react"
```

**Step 2: Replace the services section with Trust Bar + Value Split**

Replace the entire services section (id="services") with:

```tsx
{/* Trust Bar + Value Split Section */}
<section id="services" className="relative py-20 cursor-none">
  {/* Continuous dark gradient background */}
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
      {/* For Brands */}
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

      {/* For Influencers */}
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
```

**Step 3: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add trust bar and value split section"
```

---

## Task 10: Create Why QuantivoTech Section

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace the about section with Why QuantivoTech**

Replace the entire about section (id="about") with:

```tsx
{/* Why QuantivoTech Section */}
<section id="about" className="relative py-20 cursor-none">
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

  {/* Background 3D element */}
  <FloatingShapes className="z-5 opacity-50" opacity={0.05} speed={0.2} count={5} />

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
      {/* Card 1 - Niche Focus */}
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

      {/* Card 2 - Personal Touch */}
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
```

**Step 2: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add Why QuantivoTech differentiators section"
```

---

## Task 11: Create Results / Social Proof Section

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add StatCard import**

Add to imports:
```tsx
import { StatCard } from "./components/stat-card"
```

**Step 2: Add Results section after the Why QuantivoTech section**

Add this new section:

```tsx
{/* Results / Social Proof Section */}
<section className="relative py-20 cursor-none">
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

  <div className="relative z-10 max-w-6xl mx-auto px-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
      <StatCard value={500} suffix="+" label="Influencer Partners" delay={0} />
      <StatCard value={98} suffix="%" label="Client Satisfaction" delay={0.1} />
      <StatCard value={10} suffix="x" label="Average Campaign ROI" delay={0.2} />
      <StatCard value={24} suffix="hr" label="Response Time" delay={0.3} />
    </div>

    {/* Testimonial */}
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
```

**Step 3: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add results and social proof section"
```

---

## Task 12: Add How It Works Section

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add ProcessTimeline import**

Add to imports:
```tsx
import { ProcessTimeline } from "./components/process-timeline"
```

**Step 2: Add How It Works section after Results**

```tsx
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
```

**Step 3: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add How It Works process timeline section"
```

---

## Task 13: Rebuild Contact Section with Dual Forms

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace the contact section with dual CTA forms**

Replace the entire contact section (id="contact") with:

```tsx
{/* Dual CTA / Contact Section */}
<section id="contact" className="relative py-20 cursor-none">
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a] z-0" />

  {/* Background 3D element */}
  <FloatingShapes className="z-5" opacity={0.08} speed={0.15} count={4} />

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
      {/* For Brands Form */}
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
            <Input
              placeholder="Company Name"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-sky-400/50"
            />
            <Input
              placeholder="Your Name"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-sky-400/50"
            />
            <Input
              type="email"
              placeholder="Email"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-sky-400/50"
            />
            <Textarea
              placeholder="What are you looking for?"
              rows={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-sky-400/50 resize-none"
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* For Influencers Form */}
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
            <Input
              placeholder="Your Name"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-400/50"
            />
            <Input
              type="email"
              placeholder="Email"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-400/50"
            />
            <Input
              placeholder="Social Profile Link"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-400/50"
            />
            <Textarea
              placeholder="Tell us about your audience"
              rows={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-400/50 resize-none"
            />
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
```

**Step 2: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add dual CTA contact forms for brands and influencers"
```

---

## Task 14: Rebuild Footer

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace the footer section**

Replace the entire footer with:

```tsx
{/* Footer */}
<footer className="relative py-12 cursor-none">
  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] to-[#050810] z-0" />

  <div className="relative z-10 max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-4 gap-8 text-center md:text-left mb-12">
      {/* Brand */}
      <div className="md:col-span-1 flex flex-col items-center md:items-start">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-white">QuantivoTech</span>
        </div>
        <p className="text-white/40 text-sm font-light">
          Connecting brands with influential voices.
        </p>
      </div>

      {/* Quick Links */}
      <div className="text-center md:text-left">
        <h4 className="font-medium text-white mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm text-white/40">
          <li className="hover:text-white/70 transition-colors cursor-pointer">For Brands</li>
          <li className="hover:text-white/70 transition-colors cursor-pointer">For Influencers</li>
          <li className="hover:text-white/70 transition-colors cursor-pointer">How It Works</li>
        </ul>
      </div>

      {/* Company */}
      <div className="text-center md:text-left">
        <h4 className="font-medium text-white mb-4">Company</h4>
        <ul className="space-y-2 text-sm text-white/40">
          <li className="hover:text-white/70 transition-colors cursor-pointer">About Us</li>
          <li className="hover:text-white/70 transition-colors cursor-pointer">Contact</li>
          <li className="hover:text-white/70 transition-colors cursor-pointer">Privacy Policy</li>
        </ul>
      </div>

      {/* Connect */}
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

    {/* Bottom bar */}
    <div className="border-t border-white/10 pt-8 text-center">
      <p className="text-sm text-white/30">
        © 2025 QuantivoTech. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

**Step 2: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: rebuild footer with dark theme"
```

---

## Task 15: Update Navigation and Floating Nav

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update the floating nav styling for dark theme**

Find the floating navigation section and update the styling:

```tsx
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
      <div className="glass-strong rounded-full px-3 sm:px-6 py-2 sm:py-3">
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
```

**Step 2: Update the brand logo for dark theme**

```tsx
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
  <span className="text-lg sm:text-xl font-medium text-white">QuantivoTech</span>
</motion.div>
```

**Step 3: Update the main container background**

Change the main container class from:
```tsx
<div className="min-h-screen bg-white overflow-x-hidden cursor-none">
```
to:
```tsx
<div className="min-h-screen bg-[#0a0f1a] overflow-x-hidden cursor-none">
```

**Step 4: Update cursor glow for dark theme**

Update the cursor glow gradient:
```tsx
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
```

**Step 5: Update custom cursor ring color**

```tsx
<div
  className="fixed w-6 h-6 border-2 border-white/50 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out"
  style={{
    left: mousePosition.x - 12,
    top: mousePosition.y - 12,
    backgroundColor: "transparent",
  }}
/>
```

**Step 6: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update navigation and UI elements for dark theme"
```

---

## Task 16: Update ShaderText for New Headline

**Files:**
- Modify: `src/components/shader-text.tsx`

**Step 1: Update the text splitting logic for the new headline**

Find the text rendering section (around line 178-195) and update:

```tsx
// Split text into two lines and center them properly
const lines = text.split(", ")
const line1 = lines[0] || "Where SaaS Brands"
const line2 = lines[1] || "Meet Real Influence"
```

**Step 2: Verify changes compile**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/shader-text.tsx
git commit -m "feat: update shader text for new headline"
```

---

## Task 17: Remove Unused Code and Clean Up

**Files:**
- Modify: `src/App.tsx`

**Step 1: Remove unused imports and variables**

Remove these unused imports:
- `Phone`, `MapPin`, `Shield`, `Award`, `Code`, `Smartphone`, `Brain`, `Calendar`, `Zap` (if not used)
- Remove `services` array (old services data)
- Remove `galleryImages` array (old gallery data)
- Remove `servicesRef`, `servicesScrollProgress`, `imagesX` if no longer needed
- Remove `heroY` if not used

**Step 2: Clean up any remaining light-theme classes**

Search for and replace any remaining:
- `bg-white` → remove or update
- `bg-stone-50` → remove
- `text-gray-*` → update to `text-white/*`
- `bg-gray-*` → update to dark equivalents
- `border-gray-*` → update to `border-white/*`

**Step 3: Verify the app runs correctly**

Run: `npm run dev`
Expected: App runs with dark theme, all sections visible

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: remove unused code and clean up light theme remnants"
```

---

## Task 18: Final Build and Test

**Files:**
- All modified files

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

**Step 3: Test locally**

Run: `npm run dev`
Expected:
- Dark gradient background flows continuously
- Hero section shows with water shader headline
- Dual CTAs visible ("I'm a Brand" / "I'm an Influencer")
- Trust bar and value split cards display
- Why QuantivoTech section with differentiator cards
- Stats count up on scroll
- Timeline process section works
- Dual contact forms functional
- Footer displays correctly
- Floating 3D shapes visible and animated
- Particles follow mouse with parallax
- Navigation works for all sections

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete influencer marketing website redesign"
```

---

## Summary

This plan transforms the QuantivoTech website from a tech services site to an influencer marketing agency site with:

1. **Dark theme** - Continuous gradient background
2. **3D elements** - Floating Three.js shapes, water shader text
3. **Glassmorphism** - Glass cards with tilt effects
4. **New sections** - Trust bar, value split, differentiators, stats, timeline, dual CTAs
5. **Preserved animations** - Particles, scroll effects, cursor glow

Total tasks: 18
Estimated files modified: ~10
New files created: 5

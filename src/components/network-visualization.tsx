import { useEffect, useRef } from "react"

interface NetworkVisualizationProps {
  className?: string
  nodeCount?: number
  connectionDistance?: number
  speed?: number
  opacity?: number
}

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulsePhase: number
}

export function NetworkVisualization({
  className = "",
  nodeCount = 40,
  connectionDistance = 150,
  speed = 0.15,
  opacity = 0.4,
}: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0

    const setCanvasSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        width = rect.width
        height = rect.height
        canvas.width = width
        canvas.height = height
      }
    }

    const initNodes = () => {
      nodesRef.current = []
      for (let i = 0; i < nodeCount; i++) {
        // Random angle for slow drift direction
        const angle = Math.random() * Math.PI * 2
        nodesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 2,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      const nodes = nodesRef.current
      const mouse = mouseRef.current

      // Subtle parallax offset based on mouse
      const parallaxX = (mouse.x - width / 2) * 0.02
      const parallaxY = (mouse.y - height / 2) * 0.02

      // Update and draw nodes
      nodes.forEach((node) => {
        // Slow drift movement
        node.x += node.vx
        node.y += node.vy

        // Wrap around edges
        if (node.x < -20) node.x = width + 20
        if (node.x > width + 20) node.x = -20
        if (node.y < -20) node.y = height + 20
        if (node.y > height + 20) node.y = -20
      })

      // Draw connections first (behind nodes)
      ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.3})`
      ctx.lineWidth = 1

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            // Fade connection based on distance
            const connectionOpacity = (1 - dist / connectionDistance) * opacity * 0.4
            ctx.strokeStyle = `rgba(56, 189, 248, ${connectionOpacity})`
            ctx.beginPath()
            ctx.moveTo(nodes[i].x + parallaxX, nodes[i].y + parallaxY)
            ctx.lineTo(nodes[j].x + parallaxX, nodes[j].y + parallaxY)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        // Subtle pulse effect
        const pulse = Math.sin(time * 0.001 + node.pulsePhase) * 0.3 + 1
        const currentRadius = node.radius * pulse

        // Node glow
        const gradient = ctx.createRadialGradient(
          node.x + parallaxX,
          node.y + parallaxY,
          0,
          node.x + parallaxX,
          node.y + parallaxY,
          currentRadius * 3
        )
        gradient.addColorStop(0, `rgba(56, 189, 248, ${opacity})`)
        gradient.addColorStop(0.5, `rgba(56, 189, 248, ${opacity * 0.3})`)
        gradient.addColorStop(1, "rgba(56, 189, 248, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x + parallaxX, node.y + parallaxY, currentRadius * 3, 0, Math.PI * 2)
        ctx.fill()

        // Node core
        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`
        ctx.beginPath()
        ctx.arc(node.x + parallaxX, node.y + parallaxY, currentRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(render)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleResize = () => {
      setCanvasSize()
      initNodes()
    }

    // Initialize
    setCanvasSize()
    initNodes()
    animationRef.current = requestAnimationFrame(render)

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodeCount, connectionDistance, speed, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  )
}

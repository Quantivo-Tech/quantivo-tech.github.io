import { useState, useEffect, useCallback, useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

interface CursorPosition {
  x: number
  y: number
}

export function useCursor() {
  const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const frameRef = useRef<number>(0)
  const lastUpdateRef = useRef<number>(0)
  
  // Motion values for smooth cursor glow following
  const glowX = useMotionValue(0)
  const glowY = useMotionValue(0)

  // Optimized spring physics
  const springGlowX = useSpring(glowX, {
    damping: 30,
    stiffness: 400,
    mass: 0.5,
  })
  const springGlowY = useSpring(glowY, {
    damping: 30,
    stiffness: 400,
    mass: 0.5,
  })

  // Throttled mouse move handler using RAF
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = performance.now()
    
    // Throttle to ~60fps (16ms)
    if (now - lastUpdateRef.current < 16) {
      return
    }
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }
    
    frameRef.current = requestAnimationFrame(() => {
      const newX = e.clientX
      const newY = e.clientY

      setMousePosition({ x: newX, y: newY })
      
      // Update glow position
      glowX.set(newX - 50)
      glowY.set(newY - 50)
      
      lastUpdateRef.current = now
    })
  }, [glowX, glowY])

  useEffect(() => {
    // Use passive listener for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [handleMouseMove])

  return {
    mousePosition,
    springGlowX,
    springGlowY,
  }
} 
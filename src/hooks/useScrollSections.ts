import { useState, useEffect, useCallback, useRef } from 'react'

interface ScrollSectionResult {
  activeSection: string
  showFloatingNav: boolean
}

export function useScrollSections(): ScrollSectionResult {
  const [activeSection, setActiveSection] = useState('home')
  const [showFloatingNav, setShowFloatingNav] = useState(false)
  const frameRef = useRef<number>(0)
  const lastScrollRef = useRef<number>(0)

  const handleScroll = useCallback(() => {
    const now = performance.now()
    
    // Throttle to ~30fps for scroll (33ms) - good balance of performance and responsiveness
    if (now - lastScrollRef.current < 33) {
      return
    }

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = requestAnimationFrame(() => {
      const sections = ['home', 'services', 'about', 'contact']
      const scrollPosition = window.scrollY + 100

      // Show floating nav after scrolling past hero (optimized)
      const shouldShowNav = window.scrollY > window.innerHeight * 0.3
      setShowFloatingNav(shouldShowNav)

      // Find active section
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }

      lastScrollRef.current = now
    })
  }, [])

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [handleScroll])

  return {
    activeSection,
    showFloatingNav,
  }
} 
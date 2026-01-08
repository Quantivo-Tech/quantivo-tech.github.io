import { createContext, useContext, useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"

interface SmoothScrollContextType {
  lenis: Lenis | null
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null })

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis - TUNED FOR IMMEDIATE RESPONSE
    // Goal: Snappy start, buttery end - no "heavy start" lag
    const lenis = new Lenis({
      lerp: 0.1,            // Increased from 0.08 - more responsive start
      duration: 1.2,        // Reduced from 1.4 - faster overall
      smoothWheel: true,    // Smooth mouse wheel
      wheelMultiplier: 1.0, // Increased from 0.8 - more responsive
      touchMultiplier: 1.5, // Responsive touch
      infinite: false,
    })

    lenisRef.current = lenis

    // RAF loop to keep Lenis running
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Add lenis class to html for CSS hooks
    document.documentElement.classList.add("lenis")

    return () => {
      lenis.destroy()
      document.documentElement.classList.remove("lenis")
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

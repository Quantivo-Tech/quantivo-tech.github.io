import { useEffect, useState } from "react"
import { motion, useSpring } from "framer-motion"

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  // Smooth spring animation for the progress
  const smoothProgress = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const newProgress = scrollHeight > 0 ? scrolled / scrollHeight : 0
      setProgress(newProgress)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-sky-400 via-purple-500 to-sky-400 origin-left"
        style={{
          scaleX: smoothProgress,
        }}
      />
    </div>
  )
}

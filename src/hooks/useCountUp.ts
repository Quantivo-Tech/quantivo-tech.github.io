import { useState, useEffect, useRef, useCallback } from "react"

interface UseCountUpOptions {
  end: number
  duration?: number
  start?: number
  decimals?: number
  suffix?: string
  prefix?: string
  onComplete?: () => void
}

export function useCountUp({
  end,
  duration = 1500, // Reduced from 2000 for snappier feel
  start = 0,
  decimals = 0,
  suffix = "",
  prefix = "",
  onComplete,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const onCompleteRef = useRef(onComplete)

  // Keep the ref updated with latest callback
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

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

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = start + (end - start) * easeOut

      setCount(currentCount)

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      } else {
        // Animation complete
        setIsComplete(true)
        onCompleteRef.current?.()
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [isVisible, end, duration, start])

  const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`

  return { count: formattedCount, ref, isComplete, isVisible }
}

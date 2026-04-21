import { useEffect, useRef, useState } from 'react'

// Easing curve for the count-up on mount / on value change.
// "easeOutCubic" — feels snappy at start, settles softly.
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

interface AnimatedNumberProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

export default function AnimatedNumber({
  value,
  duration = 1200,
  format = (n) => n.toLocaleString(),
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const rafRef = useRef<number | null>(null)
  const prev = useRef(value)

  useEffect(() => {
    // Cancel any in-flight animation so a quick toggle doesn't stall mid-flight.
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const start = performance.now()
    const from = prev.current
    const to = value

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = easeOutCubic(t)
      setDisplay(from + (to - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(step)
      else {
        prev.current = to
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return <span className={className}>{format(display)}</span>
}

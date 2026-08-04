import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import './StatsCard.scss'

interface Props {
  value: number
  unit: string
  subtitle: string
  extra?: string
  accent: 'cyan' | 'pink' | 'lime'
  onNext: () => void
}

const ACCENTS = {
  cyan: { color: '#00f5ff', rgb: '0, 245, 255' },
  pink: { color: '#ff2d78', rgb: '255, 45, 120' },
  lime: { color: '#aaff00', rgb: '170, 255, 0' },
}

function useCountUp(target: number, duration = 2200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const start = Date.now()
    let raf: number

    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1)
      // Ease out quart
      const eased = 1 - Math.pow(1 - t, 4)
      setCount(Math.floor(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return count
}

function useTypewriter(text: string, delay = 0, speed = 38) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let intervalId: ReturnType<typeof setInterval>

    const timeoutId = setTimeout(() => {
      let i = 0
      intervalId = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(intervalId)
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [text, delay, speed])

  return displayed
}

export default function StatsCard({ value, unit, subtitle, extra, accent, onNext }: Props) {
  const count = useCountUp(value)
  const displayedSub = useTypewriter(subtitle, 1300, 38)
  const { color, rgb } = useMemo(() => ACCENTS[accent], [accent])

  const formatted = count.toLocaleString('sv-SE')
  const showButton = count >= value

  return (
    <motion.div
      className="stats-card"
      initial={{ y: 70, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -70, opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ '--accent': color, '--rgb': rgb } as React.CSSProperties}
    >
      <div className="sc-corner sc-corner--tl">┌─</div>
      <div className="sc-corner sc-corner--tr">─┐</div>
      <div className="sc-corner sc-corner--bl">└─</div>
      <div className="sc-corner sc-corner--br">─┘</div>

      <div className="sc-label">// BERÄKNAT STATISTIK //</div>

      <div className="sc-number-wrap">
        <span className="sc-number">{formatted}</span>
        <span className="sc-unit">{unit}</span>
      </div>

      <p className="sc-subtitle">
        {displayedSub}
        <span className="sc-cursor">_</span>
      </p>

      {extra && (
        <motion.p
          className="sc-extra"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: 3.2 }}
        >
          {extra}
        </motion.p>
      )}

      <motion.button
        className="sc-btn"
        onClick={onNext}
        initial={{ opacity: 0, y: 10 }}
        animate={showButton ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
        whileTap={{ scale: 0.94 }}
      >
        [ NÄSTA ] →
      </motion.button>
    </motion.div>
  )
}

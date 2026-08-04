import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import './FinalCard.scss'

function useTypewriter(text: string, delay = 0, speed = 55) {
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

interface ConfettiPiece {
  id: number
  x: number
  duration: number
  delay: number
  rotate: number
  color: string
  size: number
}

const CONFETTI_COLORS = ['#ff2d78', '#00f5ff', '#aaff00', '#ffd700', '#ff6b35', '#c084fc']

export default function FinalCard() {
  const line1 = useTypewriter('GRATTIS PÅ 30-ÅRSDAGEN', 200, 55)
  const line2 = useTypewriter('CORNELIA INGVARSSON!', 1900, 55)

  const confetti = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        duration: 2.2 + Math.random() * 2.5,
        delay: Math.random() * 1.8,
        rotate: Math.random() * 720 - 360,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
      })),
    [],
  )

  return (
    <motion.div
      className="final-card"
      initial={{ opacity: 0, scale: 0.82, rotate: -1.5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.82 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Confetti */}
      <div className="confetti-layer" aria-hidden>
        {confetti.map(p => (
          <motion.div
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.id % 3 === 0 ? '50%' : '2px',
            }}
            initial={{ y: -30, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 40,
              opacity: [1, 1, 1, 0],
              rotate: p.rotate,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        ))}
      </div>

      <div className="fc-corner fc-corner--tl">┌──</div>
      <div className="fc-corner fc-corner--tr">──┐</div>
      <div className="fc-corner fc-corner--bl">└──</div>
      <div className="fc-corner fc-corner--br">──┘</div>

      <div className="fc-stars">★ ★ ★ ★ ★</div>

      <div className="fc-greeting">
        <p className="fc-greeting-1">
          {line1}
          {line1.length < 22 && <span className="fc-cursor">_</span>}
        </p>
        <p className="fc-greeting-2">
          {line2}
          {line1.length >= 22 && line2.length < 20 && <span className="fc-cursor">_</span>}
        </p>
      </div>

      {/* Gift card */}
      <motion.div
        className="gift-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="gc-header">
          <span className="gc-brand">CLAUDE</span>
          <span className="gc-tag">PRESENTKORT</span>
        </div>
        <div className="gc-divider">══════════════════════</div>
        <div className="gc-value">1 MÅNAD PRO</div>
        <div className="gc-divider gc-divider--thin">──────────────────────</div>
        <div className="gc-from">FRÅN: HANNES MED KÄRLEK</div>
        <div className="gc-noise">░░░░░░░░░░░░░░░░░░░░░░</div>
      </motion.div>

      <motion.p
        className="fc-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.5 }}
      >
        du är äntligen gammal — grattis!
      </motion.p>
    </motion.div>
  )
}

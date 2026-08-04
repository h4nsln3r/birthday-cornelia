import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import './GiftBox.scss'

interface Props {
  onOpened: () => void
}

const SHAKE_SMALL = {
  x: [0, -14, 14, -10, 10, -5, 5, 0],
  transition: { duration: 0.45, ease: 'easeOut' },
}
const SHAKE_BIG = {
  x: [0, -22, 22, -16, 16, -9, 9, -4, 4, 0],
  y: [0, -4, 4, -2, 2, 0],
  transition: { duration: 0.55, ease: 'easeOut' },
}

const SPARKLE_POSITIONS = [
  { top: '18%', left: '8%' },
  { top: '30%', left: '88%' },
  { top: '55%', left: '5%' },
  { top: '65%', left: '92%' },
  { top: '10%', left: '40%' },
  { top: '78%', left: '55%' },
  { top: '42%', left: '95%' },
  { top: '85%', left: '20%' },
]

const hints = [
  '[ TRYCK FÖR ATT ÖPPNA ]',
  '[ EN GÅNG TILL... ]',
  '[ SISTA GÅNGEN! ]',
]

export default function GiftBox({ onOpened }: Props) {
  const [clicks, setClicks] = useState(0)
  const [opening, setOpening] = useState(false)

  const giftControls = useAnimation()
  const lidControls = useAnimation()

  const handleClick = async () => {
    if (opening) return

    if (clicks < 2) {
      const next = clicks + 1
      setClicks(next)
      await giftControls.start(next === 1 ? SHAKE_SMALL : SHAKE_BIG)
    } else {
      setOpening(true)

      // Lid launches upward
      lidControls.start({
        y: -280,
        rotate: -35,
        scale: 1.15,
        opacity: 0,
        transition: { duration: 0.65, ease: [0.32, 0, 0.67, 0] },
      })
      // Body does a small victory bounce
      await giftControls.start({
        y: [0, -14, 0, 8, 0],
        transition: { duration: 0.55, delay: 0.15, ease: 'easeOut' },
      })

      await new Promise<void>(r => setTimeout(r, 250))
      onOpened()
    }
  }

  return (
    <motion.div
      className="gift-scene"
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="gift-wrap" animate={giftControls}>
        {/* Lid */}
        <motion.div className="gift-lid" animate={lidControls}>
          <div className="ribbon-v" />
          <div className="bow">
            <div className="bow-loop bow-loop--left" />
            <div className="bow-loop bow-loop--right" />
            <div className="bow-knot" />
          </div>
        </motion.div>

        {/* Body */}
        <div className="gift-body">
          <div className="ribbon-h" />
          <div className="ribbon-v" />
          {opening && (
            <motion.div
              className="gift-glow"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      </motion.div>

      <motion.p
        className="hint-text"
        key={clicks}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {hints[clicks]}
      </motion.p>

      {/* Ambient sparkles */}
      <div className="sparkles" aria-hidden>
        {SPARKLE_POSITIONS.map((pos, i) => (
          <div
            key={i}
            className="sparkle"
            style={{ '--delay': `${i * 0.28}s`, '--dur': `${1.8 + i * 0.22}s`, top: pos.top, left: pos.left } as React.CSSProperties}
          />
        ))}
      </div>
    </motion.div>
  )
}

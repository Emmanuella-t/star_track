import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useState, type MouseEvent, type ReactNode } from 'react'
import { easeOutSoft } from '../motion/variants'
import './ProductPreviews.css'

type CardKey = 'chat' | 'progress' | 'booking'

type FloatConfig = {
  key: CardKey
  delay: number
  floatDuration: number
  floatY: number
  rotate: number
  parallax: number
}

const FLOAT_CONFIG: FloatConfig[] = [
  { key: 'chat', delay: 0.12, floatDuration: 5.8, floatY: 10, rotate: -3.2, parallax: 14 },
  { key: 'progress', delay: 0.28, floatDuration: 6.7, floatY: 14, rotate: 2.6, parallax: 10 },
  { key: 'booking', delay: 0.42, floatDuration: 7.4, floatY: 12, rotate: -1.4, parallax: 16 },
]

function FloatingCard({
  config,
  pointer,
  children,
}: {
  config: FloatConfig
  pointer: { x: number; y: number }
  children: ReactNode
}) {
  const reduceMotion = useReducedMotion()

  return (
    /* Layer 1: entrance + base rotation */
    <motion.div
      className={`preview-stage-item preview-stage-item--${config.key}`}
      initial={reduceMotion ? false : { opacity: 0, y: 44, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: config.delay, ease: easeOutSoft }}
      style={{ rotate: config.rotate }}
    >
      {/* Layer 2: pointer parallax */}
      <motion.div
        className="preview-parallax-layer"
        animate={{
          x: reduceMotion ? 0 : pointer.x * config.parallax,
          y: reduceMotion ? 0 : pointer.y * config.parallax * 0.55,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 0.35 }}
      >
        {/* Layer 3: continuous float */}
        <motion.div
          className="preview-float-layer"
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -config.floatY, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: config.floatDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: config.delay * 0.35,
                }
          }
        >
          {/* Layer 4: hover lift */}
          <motion.article
            className={`preview-card preview-card--${config.key}`}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    y: -10,
                    scale: 1.035,
                    boxShadow:
                      '0 28px 58px rgba(8, 28, 22, 0.28), 0 8px 18px rgba(8, 28, 22, 0.12)',
                  }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {children}
          </motion.article>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function ProductPreviews() {
  const reduceMotion = useReducedMotion()
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const handlePointerMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return
      if (typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches) {
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      setPointer({ x, y })
    },
    [reduceMotion],
  )

  const handlePointerLeave = useCallback(() => {
    setPointer({ x: 0, y: 0 })
  }, [])

  const cards: Record<CardKey, ReactNode> = {
    chat: (
      <>
        <header className="preview-card__header">
          <span>Ask Star Track</span>
        </header>
        <div className="preview-card__body">
          <div className="chat-bubble chat-bubble--user">
            Do I need Calc before Data Structures?
          </div>
          <div className="chat-bubble chat-bubble--bot">
            The catalog lists CSCI 120 as the prerequisite for CSCI 230.
            <cite>Catalog · Sec. 4.2</cite>
          </div>
        </div>
      </>
    ),
    progress: (
      <>
        <header className="preview-card__header">
          <span>Degree progress</span>
        </header>
        <div className="preview-card__body">
          <p className="progress-label">Computer Science checklist</p>
          <div className="progress-bar" role="presentation">
            <span style={{ width: '58%' }} />
          </div>
          <ul className="progress-list">
            <li data-done="true">ENG 113 Composition</li>
            <li data-done="true">CSCI 120 Intro to CS</li>
            <li data-done="false">CSCI 230 Data Structures</li>
          </ul>
        </div>
      </>
    ),
    booking: (
      <>
        <header className="preview-card__header">
          <span>Advisor appointments</span>
        </header>
        <div className="preview-card__body">
          <div className="slot-row">
            <div>
              <strong>Tue · 2:00 PM</strong>
              <span>Advisor A · Office hours</span>
            </div>
            <span className="slot-chip">Open</span>
          </div>
          <div className="slot-row slot-row--active">
            <div>
              <strong>Wed · 10:30 AM</strong>
              <span>Your booking</span>
            </div>
            <span className="slot-chip slot-chip--booked">Booked</span>
          </div>
        </div>
      </>
    ),
  }

  return (
    <div
      className="product-previews"
      role="group"
      aria-label="Product previews for AI advising, degree progress, and appointments"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {FLOAT_CONFIG.map((config) => (
        <FloatingCard key={config.key} config={config} pointer={pointer}>
          {cards[config.key]}
        </FloatingCard>
      ))}
    </div>
  )
}

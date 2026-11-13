import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'
import { Button } from '../components/Button'
import { ProductPreviews } from '../components/ProductPreviews'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { Reveal } from '../motion/Reveal'
import { Stagger } from '../motion/Stagger'
import { StaggerItem } from '../motion/StaggerItem'
import { fadeUp, scaleFade } from '../motion/variants'
import './LandingPage.css'

export function LandingPage() {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const glowOneY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const glowTwoY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const orbitY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [18, 36])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 48])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.35])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 28])

  return (
    <div className="landing">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader variant="marketing" inverted />

      <main id="main-content">
        <section ref={heroRef} className="hero" aria-labelledby="hero-heading">
          <motion.div
            className="hero__glow hero__glow--one"
            aria-hidden="true"
            style={reduceMotion ? undefined : { y: glowOneY }}
          />
          <motion.div
            className="hero__glow hero__glow--two"
            aria-hidden="true"
            style={reduceMotion ? undefined : { y: glowTwoY }}
          />
          <motion.div
            className="hero__orbit"
            aria-hidden="true"
            style={reduceMotion ? undefined : { y: orbitY, rotate: orbitRotate }}
          />

          <div className="container hero__grid">
            <motion.div
              className="hero__copy"
              style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
            >
              <motion.p
                className="hero__eyebrow"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
              >
                Star Track · Academic planning
              </motion.p>
              <motion.h1
                id="hero-heading"
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
              >
                College is complicated.
                <span>Planning your classes shouldn&apos;t be.</span>
              </motion.h1>
              <motion.p
                className="hero__lead"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.22 }}
              >
                Keep track of your courses, get answers to your questions, and find time to meet
                with your advisor. All in one place.
              </motion.p>
              <motion.div
                className="hero__actions"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
              >
                <Button to="/demo" variant="gold" size="lg">
                  Get Started
                </Button>
                <Button href="/#how-it-works" variant="secondary" size="lg">
                  See How It Works
                </Button>
              </motion.div>
              <motion.p
                className="hero__note"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.42 }}
              >
                Plan with confidence, then confirm details with your advisor.
              </motion.p>
            </motion.div>

            <motion.div
              className="hero__visual"
              style={reduceMotion ? undefined : { y: visualY }}
            >
              <ProductPreviews />
            </motion.div>
          </div>

          <div className="hero__blend" aria-hidden="true" />
        </section>

        <section id="features" className="features" aria-labelledby="features-heading">
          <div className="container">
            <Reveal>
              <p className="section-kicker">Features</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="features-heading" className="features__title">
                Three tools students actually need during advising season.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="features__intro">
                Built around one Computer Science plan and approved catalog documents, so answers
                stay grounded and easy to check.
              </p>
            </Reveal>

            <Stagger className="feature-mosaic" stagger={0.14} delayChildren={0.08}>
              <StaggerItem as="article" className="feature-panel feature-panel--wide" variants={scaleFade}>
                <div className="feature-panel__text">
                  <h3>Ask a catalog question</h3>
                  <p>
                    Get answers from approved academic documents, with a clear note about where
                    each answer came from. If the source is not enough, Star Track says so and points
                    you toward an advisor.
                  </p>
                </div>
                <div
                  className="feature-panel__preview feature-panel__preview--chat"
                  aria-hidden="true"
                >
                  <div className="mini-chat">
                    <span>What is the CS math sequence?</span>
                    <strong>Cited answer · Catalog handbook</strong>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem as="article" className="feature-panel feature-panel--tall" variants={scaleFade}>
                <h3>Track your own checklist</h3>
                <p>
                  Mark courses complete on your Computer Science plan and see what is left at a
                  glance.
                </p>
                <div className="feature-meter" aria-hidden="true">
                  <div>
                    <span>General education</span>
                    <b>4 / 6</b>
                  </div>
                  <div>
                    <span>Major core</span>
                    <b>3 / 8</b>
                  </div>
                  <div>
                    <span>Electives</span>
                    <b>1 / 3</b>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem
                as="article"
                className="feature-panel feature-panel--accent"
                variants={scaleFade}
              >
                <h3>Book advisor time</h3>
                <p>
                  Browse open advising slots, reserve one meeting, and keep that appointment
                  visible on your dashboard.
                </p>
                <p className="feature-panel__tag">Appointment availability</p>
              </StaggerItem>

              <StaggerItem as="article" className="feature-panel feature-panel--note" variants={scaleFade}>
                <h3>Honest about limits</h3>
                <p>
                  Star Track does not pull transcripts, register you for classes, or replace your
                  advisor. It helps you prepare for the conversation.
                </p>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        <section id="how-it-works" className="how" aria-labelledby="how-heading">
          <div className="container">
            <Reveal>
              <p className="section-kicker">How it works</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="how-heading">A simple path from question to conversation.</h2>
            </Reveal>

            <Stagger className="how__steps" as="ol" stagger={0.18} delayChildren={0.1}>
              <StaggerItem as="li" variants={fadeUp}>
                <span className="how__index">1</span>
                <div>
                  <h3>Ask about the catalog</h3>
                  <p>Start with a question grounded in approved catalog documents.</p>
                </div>
              </StaggerItem>
              <StaggerItem as="li" variants={fadeUp}>
                <span className="how__index">2</span>
                <div>
                  <h3>Update your checklist</h3>
                  <p>Mark what you have finished on your degree plan.</p>
                </div>
              </StaggerItem>
              <StaggerItem as="li" variants={fadeUp}>
                <span className="how__index">3</span>
                <div>
                  <h3>Meet your advisor</h3>
                  <p>Book an appointment when you want a human check-in.</p>
                </div>
              </StaggerItem>
            </Stagger>

            <Reveal className="how__cta" delay={0.12}>
              <Button to="/demo" variant="primary" size="lg">
                Get Started
              </Button>
            </Reveal>
          </div>
        </section>
      </main>

      <Reveal className="landing-footer-motion" amount={0.15}>
        <SiteFooter />
      </Reveal>
    </div>
  )
}

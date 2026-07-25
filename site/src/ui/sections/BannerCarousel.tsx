import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { bannerSlides } from '@/config/banners'
import { buttonStyles } from '@/ui/components/Button'
import { ArrowRightIcon } from '@/ui/components/icons'
import { cn } from '@/lib/cn'

const AUTOPLAY_MS = 6500

/**
 * Carrossel principal, no lugar do banner do topo.
 *
 * Cada slide leva um véu escuro por cima da foto. Isso não é decoração: o
 * header fica transparente sobre este bloco, e sem o véu o texto branco (dele e
 * do slide) some assim que entrar uma foto clara.
 *
 * O autoplay para no hover, no foco de teclado e para quem pediu menos
 * movimento no sistema — carrossel que troca sozinho enquanto a pessoa lê é
 * hostil, não dinâmico.
 */
export function BannerCarousel() {
  const [index, setIndex] = useState(0)
  const [isPaused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLElement>(null)

  const total = bannerSlides.length
  const slide = bannerSlides[index]

  const goTo = useCallback((next: number) => {
    setIndex(((next % bannerSlides.length) + bannerSlides.length) % bannerSlides.length)
  }, [])

  useEffect(() => {
    if (isPaused || total <= 1 || reduceMotion === true) return

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, total, reduceMotion])

  // Setas do teclado navegam quando o carrossel está em foco.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') goTo(index + 1)
    if (event.key === 'ArrowLeft') goTo(index - 1)
  }

  if (slide === undefined) return null

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-ink-950 text-cream"
      aria-roledescription="carrossel"
      aria-label="Destaques da loja"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={reduceMotion === true ? false : { opacity: 0 }}
          animate={reduceMotion === true ? {} : { opacity: 1 }}
          exit={reduceMotion === true ? {} : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
          aria-roledescription="slide"
          aria-label={`${index + 1} de ${total}`}
        >
          {slide.image !== undefined ? (
            <img
              src={slide.image}
              alt={slide.imageAlt ?? ''}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[52rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold-500/10 blur-[120px]"
            />
          )}

          {/* Véu: garante contraste do texto e do header sobre qualquer foto. */}
          {slide.image !== undefined && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/75 to-ink-950/40"
            />
          )}

          <div className="container-brand relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28">
            <div className="max-w-2xl">
              <p className="eyebrow text-gold-400">{slide.eyebrow}</p>

              <h1 className="mt-4 text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {slide.description}
              </p>

              <Link to={slide.ctaTo} className={`${buttonStyles('primary', 'lg')} mt-8`}>
                {slide.ctaLabel}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {total > 1 && (
        <div className="container-brand relative pb-8">
          <div className="flex items-center gap-3">
            {bannerSlides.map((item, slideIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(slideIndex)}
                aria-label={`Ir para o slide ${slideIndex + 1}: ${item.title}`}
                aria-current={slideIndex === index}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  slideIndex === index ? 'w-10 bg-gold-500' : 'w-5 bg-cream/30 hover:bg-cream/60',
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

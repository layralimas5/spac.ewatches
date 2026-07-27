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
 * movimento no sistema, carrossel que troca sozinho enquanto a pessoa lê é
 * hostil, não dinâmico.
 */
export function BannerCarousel() {
  const [index, setIndex] = useState(0)
  const [isPaused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLElement>(null)

  const total = bannerSlides.length
  const slide = bannerSlides[index]
  const hasImage = slide?.image !== undefined

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
      className="on-dark relative overflow-hidden bg-ink-950 text-cream"
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
          className={cn(
            'relative flex items-end sm:items-center',
            // Banner de ponta a ponta trabalha com ALTURA, não com proporção:
            // a largura é a da tela, e num monitor largo manter a proporção da
            // arte daria mil pixels de altura. Por isso a altura é fixa por
            // faixa de tela, e a foto se ajusta dentro dela.
            hasImage && 'min-h-[26rem] sm:h-[30rem] sm:min-h-0 lg:h-[34rem]',
          )}
          aria-roledescription="slide"
          aria-label={`${index + 1} de ${total}`}
        >
          {slide.image !== undefined && (
            <>
              {/* Esta é a maior imagem da primeira dobra e define o LCP:
                  `fetchPriority` tira ela da fila junto com o CSS. */}
              <img
                src={slide.image}
                alt={slide.imageAlt ?? ''}
                // O corte puxa para a direita no celular, que é onde a peça
                // está nas duas artes, e sobe um pouco no desktop, onde o que
                // sai do quadro é a barra de baixo da foto.
                className="absolute inset-0 h-full w-full object-cover object-[70%_50%] sm:object-[50%_42%]"
                loading="eager"
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
              />

              {/* Véu escuro: o texto do banner é branco, e sem ele qualquer área
                  clara da foto torna o título ilegível. No celular ele sobe de
                  baixo, acompanhando o texto; no desktop vem da esquerda. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/70 to-ink-950/25 sm:bg-gradient-to-r sm:from-ink-950/95 sm:via-ink-950/75 sm:to-ink-950/40"
              />
            </>
          )}

          <div
            className={cn(
              'container-brand relative w-full py-12 sm:py-16',
              !hasImage && 'sm:py-24 lg:py-28',
            )}
          >
            <div className="max-w-2xl">
              <p className="eyebrow text-muted">{slide.eyebrow}</p>

              <h1 className="mt-2 text-2xl leading-[1.2] text-cream sm:mt-4 sm:text-5xl sm:leading-[1.1] lg:text-6xl">
                {slide.title}
              </h1>

              <p className="mt-2.5 max-w-xl text-[0.8125rem] leading-relaxed text-muted sm:mt-5 sm:text-lg">
                {slide.description}
              </p>

              {/* Botão no tamanho médio no celular e grande no desktop: na tela
                  pequena ele divide espaço com título e texto, e um botão de
                  largura total ali rouba a atenção da peça na foto. */}
              <Link
                to={slide.ctaTo}
                className={buttonStyles(
                  'primary-dark',
                  'md',
                  'mt-5 sm:mt-8 sm:h-12 sm:px-7 sm:text-sm',
                )}
              >
                {slide.ctaLabel}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {total > 1 && (
        <div className="container-brand relative pb-6 sm:pb-8">
          <div className="flex items-center gap-3">
            {bannerSlides.map((item, slideIndex) => (
              // A área de toque tem 44px de altura; só a barrinha é fina.
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(slideIndex)}
                aria-label={`Ir para o slide ${slideIndex + 1}: ${item.title}`}
                aria-current={slideIndex === index}
                className="group -my-3 py-3"
              >
                <span
                  className={cn(
                    'block h-1 rounded-full transition-all duration-300',
                    slideIndex === index
                      ? 'w-10 bg-cream'
                      : 'w-5 bg-cream/30 group-hover:bg-cream/60',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

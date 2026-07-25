import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { buttonStyles } from '@/ui/components/Button'
import { ArrowRightIcon, WhatsAppIcon } from '@/ui/components/icons'
import { contactChannelLabel, generalContactLink } from '@/lib/whatsapp'
import { cn } from '@/lib/cn'

export function Hero() {
  const reduceMotion = useReducedMotion()
  const animate = reduceMotion !== true

  return (
    <section className="relative overflow-hidden">
      {/* Brilho dourado difuso ao fundo — a única presença "grande" do dourado, e mesmo assim a 10%. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[52rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold-500/10 blur-[120px]"
      />

      <div className="container-brand relative py-20 sm:py-28 lg:py-36">
        <motion.div
          className="max-w-3xl"
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-gold-500">Originais · Caixa e documentos</p>

          <h1 className="mt-5 font-display text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-6xl">
            O relógio que você quer,
            <span className="block text-gold-400">importado de verdade.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Peças originais em pronta-entrega e importação personalizada: você escolhe o modelo,
            a gente traz. Sem réplica, sem promessa vazia — com caixa, documentos e procedência.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/catalogo" className={buttonStyles('primary', 'lg')}>
              Ver catálogo
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <a
              href={generalContactLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles('outline', 'lg')}
            >
              <WhatsAppIcon className="h-4 w-4" />
              {`Falar no ${contactChannelLabel()}`}
            </a>
          </div>
        </motion.div>

        <motion.dl
          className="mt-16 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3"
          initial={animate ? { opacity: 0 } : false}
          animate={animate ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: '100%', label: 'Peças originais' },
            { value: 'Sob encomenda', label: 'Qualquer modelo' },
            { value: 'Caixa e documentos', label: 'Em toda peça' },
          ].map((stat) => (
            <div key={stat.label} className={cn('border-l border-ink-700 pl-4')}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-xl text-cream">{stat.value}</span>
                <span className="mt-1 block text-sm text-muted">{stat.label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { useFeaturedWatches } from '@/application/use-catalog'
import { WatchCard } from '@/ui/components/WatchCard'
import { CardSkeleton, StateMessage } from '@/ui/components/StateMessage'
import { Reveal } from '@/ui/components/Reveal'
import { buttonStyles } from '@/ui/components/Button'
import { ArrowRightIcon } from '@/ui/components/icons'

export function FeaturedWatches() {
  const state = useFeaturedWatches(4)

  return (
    <section className="container-brand py-20 sm:py-24" aria-labelledby="destaques">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-700">Seleção</p>
          <h2 id="destaques" className="mt-3 font-display text-3xl text-ink-950 sm:text-4xl">
            Em destaque agora
          </h2>
        </div>

        <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-gold-700 hover:text-gold-600">
          Ver catálogo completo
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10">
        {state.status === 'loading' && (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <StateMessage
            tone="error"
            title="Não consegui carregar os destaques"
            description="Algo falhou ao buscar o catálogo. Recarregue a página ou fale com a gente direto."
            action={
              <Link to="/catalogo" className={buttonStyles('outline-light', 'md')}>
                Ir para o catálogo
              </Link>
            }
          />
        )}

        {state.status === 'success' && state.data.length === 0 && (
          <StateMessage
            title="Nenhum destaque no momento"
            description="O catálogo completo continua disponível — dá uma olhada nas peças em estoque."
            action={
              <Link to="/catalogo" className={buttonStyles('primary', 'md')}>
                Ver catálogo
              </Link>
            }
          />
        )}

        {state.status === 'success' && state.data.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {state.data.map((watch, index) => (
              <Reveal key={watch.id} delay={index * 0.08}>
                <WatchCard watch={watch} priority={index === 0} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

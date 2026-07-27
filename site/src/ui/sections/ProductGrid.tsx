import { Link } from 'react-router-dom'
import type { AsyncState } from '@/application/use-async'
import type { Watch } from '@/domain/watch'
import { WatchCard } from '@/ui/components/WatchCard'
import { CardSkeleton, StateMessage } from '@/ui/components/StateMessage'
import { buttonStyles } from '@/ui/components/Button'

interface ProductGridProps {
  readonly id: string
  readonly title: string
  readonly state: AsyncState<Watch[]>
  /** Link do "ver todos" à direita do título. */
  readonly seeAllTo: string
  readonly priority?: boolean
}

/**
 * Grade de produtos com título e "ver todos", o bloco que a home da
 * referência repete algumas vezes ("SALE", "Últimos lançamentos").
 *
 * Existe como componente único porque a home usa duas vezes com listas
 * diferentes: duplicar a grade só para trocar o título seria copiar junto os
 * três estados (carregando, erro, vazio).
 */
export function ProductGrid({ id, title, state, seeAllTo, priority = false }: ProductGridProps) {
  return (
    <section className="container-brand py-10 sm:py-12" aria-labelledby={id}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id={id} className="text-lg font-semibold text-ink-950 sm:text-xl">
          {title}
        </h2>
        <Link
          to={seeAllTo}
          className="text-sm text-ink-500 underline underline-offset-4 hover:text-ink-950"
        >
          Ver todos
        </Link>
      </div>

      <div className="mt-6">
        {state.status === 'loading' && (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <StateMessage
            tone="error"
            title="Não consegui carregar estas peças"
            description="Algo falhou ao buscar o catálogo. Recarregue a página ou veja o catálogo completo."
            action={
              <Link to="/catalogo" className={buttonStyles('outline', 'md')}>
                Ir para o catálogo
              </Link>
            }
          />
        )}

        {state.status === 'success' && state.data.length === 0 && (
          <StateMessage
            title="Nada por aqui no momento"
            description="Esta seleção está vazia agora. O catálogo completo continua disponível."
            action={
              <Link to="/catalogo" className={buttonStyles('primary', 'md')}>
                Ver catálogo
              </Link>
            }
          />
        )}

        {state.status === 'success' && state.data.length > 0 && (
          <ul className="grid list-none grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {state.data.map((watch, index) => (
              <li key={watch.id}>
                <WatchCard watch={watch} priority={priority && index === 0} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { useCategories } from '@/application/use-catalog'
import { WatchPhoto } from '@/ui/components/WatchPhoto'
import { WatchIcon } from '@/ui/components/icons'

/**
 * Bloco "Categorias" logo abaixo do banner, no formato circular que o varejo
 * usa para navegação por marca.
 *
 * As categorias saem do próprio catálogo (as marcas em estoque), não de uma
 * lista fixa: marca nova cadastrada aparece aqui sozinha, com a foto de uma
 * peça dela como capa, e marca esgotada some, sem atalho levando para vitrine
 * vazia.
 *
 * No celular a lista rola na horizontal: com círculo pequeno, empilhar em
 * grade sobraria espaço vazio e empurraria os produtos para baixo.
 */
export function CategoryGrid() {
  const categories = useCategories()

  if (categories.status !== 'success' || categories.data.length === 0) return null

  return (
    <section className="container-brand py-8 sm:py-10" aria-labelledby="categorias">
      <h2 id="categorias" className="text-lg font-semibold text-ink-950 sm:text-xl">
        Categorias
      </h2>

      <ul className="no-scrollbar mt-5 -mx-5 flex snap-x snap-mandatory list-none gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-8 sm:overflow-visible sm:px-0">
        {categories.data.map((category) => (
          <li key={category.brand} className="shrink-0 snap-start">
            <Link
              to={`/catalogo?marca=${encodeURIComponent(category.brand)}`}
              className="group flex w-24 flex-col items-center gap-2.5 sm:w-28"
            >
              {/*
                A foto é cortada em círculo (`cover`), e não encaixada inteira:
                num alvo de 96px, mostrar a peça toda deixaria o relógio do
                tamanho de uma unha. O corte fecha no mostrador, que é o que
                identifica a marca de relance.
              */}
              <span className="hover-pulse flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-paper-line bg-paper-alt transition-colors group-hover:border-ink-950 sm:h-28 sm:w-28">
                {category.image !== undefined ? (
                  <WatchPhoto image={category.image} sizes="112px" className="scale-[1.15]" />
                ) : (
                  // Marca ainda sem foto cadastrada: o ícone da marca no lugar,
                  // que é mais honesto que um círculo cinza vazio.
                  <WatchIcon className="h-9 w-9 text-ink-400 sm:h-10 sm:w-10" />
                )}
              </span>

              <span className="line-clamp-2 w-full text-center text-xs leading-snug font-medium text-ink-950 sm:text-sm">
                {category.brand}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

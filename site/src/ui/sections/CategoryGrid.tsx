import { Link } from 'react-router-dom'
import { useBrands } from '@/application/use-catalog'
import { WatchIcon } from '@/ui/components/icons'

/**
 * Bloco "Categorias" logo abaixo do banner, como na referência.
 *
 * As categorias saem do próprio catálogo (as marcas em estoque), não de uma
 * lista fixa: marca nova cadastrada aparece aqui sozinha, e marca esgotada
 * some — sem atalho levando para vitrine vazia.
 *
 * O quadrado cinza é o espaço reservado para a foto da categoria. Quando a
 * loja tiver essas imagens, elas entram aqui sem mudar o layout.
 */
export function CategoryGrid() {
  const brands = useBrands()

  if (brands.status !== 'success' || brands.data.length === 0) return null

  return (
    <section className="container-brand py-10 sm:py-14" aria-labelledby="categorias">
      <h2 id="categorias" className="text-lg font-semibold text-ink-950 sm:text-xl">
        Categorias
      </h2>

      <ul className="mt-6 grid list-none grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {brands.data.map((brand) => (
          <li key={brand}>
            <Link to={`/catalogo?marca=${encodeURIComponent(brand)}`} className="group block">
              <div className="flex aspect-square items-center justify-center rounded-md bg-paper-alt transition-colors group-hover:bg-paper-line">
                <WatchIcon className="h-8 w-8 text-ink-400" />
              </div>
              <span className="mt-2 block text-center text-xs font-medium text-ink-950 sm:text-sm">
                {brand}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

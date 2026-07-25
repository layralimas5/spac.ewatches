import { Link } from 'react-router-dom'
import { useBrands } from '@/application/use-catalog'
import { WatchIcon } from '@/ui/components/icons'

/**
 * Atalhos por marca, no lugar da grade de categorias da referência.
 *
 * As marcas saem do próprio catálogo, não de uma lista fixa: marca nova
 * cadastrada aparece aqui sozinha, e marca esgotada some — sem link para
 * categoria vazia, que é o jeito mais rápido de frustrar quem está comprando.
 */
export function BrandGrid() {
  const brands = useBrands()

  if (brands.status !== 'success' || brands.data.length === 0) return null

  return (
    <section className="border-b border-paper-line bg-paper" aria-labelledby="marcas">
      <div className="container-brand py-12 sm:py-16">
        <h2 id="marcas" className="text-center text-xl text-ink-950 sm:text-2xl">
          Navegue por marca
        </h2>

        <ul className="mt-8 grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {brands.data.map((brand) => (
            <li key={brand}>
              <Link
                to={`/catalogo?marca=${encodeURIComponent(brand)}`}
                className="flex h-full items-center gap-3 rounded-lg border border-paper-line bg-paper-alt px-4 py-4 transition-colors hover:border-gold-600/60 hover:bg-paper"
              >
                <WatchIcon className="h-5 w-5 shrink-0 text-gold-600" />
                <span className="text-sm font-medium text-ink-950">{brand}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

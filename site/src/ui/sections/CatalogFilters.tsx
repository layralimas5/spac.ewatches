import { useBrands } from '@/application/use-catalog'
import type { Availability, CatalogSort, Condition } from '@/domain/watch'
import { SearchIcon } from '@/ui/components/icons'
import { cn } from '@/lib/cn'

export interface CatalogFilterValues {
  readonly query: string
  readonly brand: string
  readonly availability: string
  readonly condition: string
  readonly sort: CatalogSort
}

interface CatalogFiltersProps {
  readonly values: CatalogFilterValues
  readonly onChange: (patch: Partial<CatalogFilterValues>) => void
  readonly onClear: () => void
  readonly hasActiveFilters: boolean
  readonly resultCount: number
}

const availabilityOptions: ReadonlyArray<{ value: Availability | ''; label: string }> = [
  { value: '', label: 'Todas' },
  { value: 'pronta-entrega', label: 'Pronta-entrega' },
  { value: 'sob-encomenda', label: 'Sob encomenda' },
]

const conditionOptions: ReadonlyArray<{ value: Condition | ''; label: string }> = [
  { value: '', label: 'Todas' },
  { value: 'novo', label: 'Novo' },
  { value: 'seminovo', label: 'Seminovo' },
]

const sortOptions: ReadonlyArray<{ value: CatalogSort; label: string }> = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
]

const fieldClass =
  'h-11 w-full rounded-lg border border-ink-700 bg-ink-900 px-3 text-sm text-cream ' +
  'transition-colors hover:border-ink-700 focus:border-gold-600'

export function CatalogFilters({
  values,
  onChange,
  onClear,
  hasActiveFilters,
  resultCount,
}: CatalogFiltersProps) {
  const brands = useBrands()

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label htmlFor="busca" className="eyebrow text-muted">
            Buscar
          </label>
          <div className="relative mt-2">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="busca"
              type="search"
              value={values.query}
              onChange={(event) => onChange({ query: event.target.value })}
              placeholder="Marca, modelo ou referência"
              className={cn(fieldClass, 'pl-9')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="marca" className="eyebrow text-muted">
            Marca
          </label>
          <select
            id="marca"
            value={values.brand}
            onChange={(event) => onChange({ brand: event.target.value })}
            className={cn(fieldClass, 'mt-2')}
          >
            <option value="">Todas</option>
            {brands.status === 'success' &&
              brands.data.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="ordenar" className="eyebrow text-muted">
            Ordenar por
          </label>
          <select
            id="ordenar"
            value={values.sort}
            onChange={(event) => onChange({ sort: event.target.value as CatalogSort })}
            className={cn(fieldClass, 'mt-2')}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="disponibilidade" className="eyebrow text-muted">
            Disponibilidade
          </label>
          <select
            id="disponibilidade"
            value={values.availability}
            onChange={(event) => onChange({ availability: event.target.value })}
            className={cn(fieldClass, 'mt-2')}
          >
            {availabilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="condicao" className="eyebrow text-muted">
            Condição
          </label>
          <select
            id="condicao"
            value={values.condition}
            onChange={(event) => onChange({ condition: event.target.value })}
            className={cn(fieldClass, 'mt-2')}
          >
            {conditionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-ink-700 pt-4">
        {/* Região viva: quem usa leitor de tela ouve a contagem mudar sem precisar procurar. */}
        <p className="text-sm text-muted" role="status" aria-live="polite">
          {resultCount === 1 ? '1 relógio encontrado' : `${resultCount} relógios encontrados`}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-gold-400 transition-colors hover:text-gold-500"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}

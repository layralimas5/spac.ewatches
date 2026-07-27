import { useState } from 'react'
import { useBrands } from '@/application/use-catalog'
import type { Availability, CatalogSort, Condition } from '@/domain/watch'
import { ChevronDownIcon, SearchIcon } from '@/ui/components/icons'
import { cn } from '@/lib/cn'

export interface CatalogFilterValues {
  readonly query: string
  readonly brands: readonly string[]
  readonly availabilities: readonly string[]
  readonly conditions: readonly string[]
  readonly sort: CatalogSort
}

interface CatalogFiltersProps {
  readonly values: CatalogFilterValues
  readonly onChange: (patch: Partial<CatalogFilterValues>) => void
  readonly onClear: () => void
  readonly hasActiveFilters: boolean
  readonly resultCount: number
}

const availabilityOptions: ReadonlyArray<{ value: Availability; label: string }> = [
  { value: 'pronta-entrega', label: 'Pronta-entrega' },
  { value: 'sob-encomenda', label: 'Sob encomenda' },
]

const conditionOptions: ReadonlyArray<{ value: Condition; label: string }> = [
  { value: 'novo', label: 'Novo' },
  { value: 'seminovo', label: 'Seminovo' },
]

const sortOptions: ReadonlyArray<{ value: CatalogSort; label: string }> = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
]

const fieldClass =
  'h-11 w-full rounded-lg border border-paper-line bg-paper px-3 text-sm text-ink-950 ' +
  'placeholder:text-ink-500/70 transition-colors hover:border-ink-500/40 focus:border-ink-950'

/** Liga ou desliga uma opção sem alterar a lista recebida. */
function toggle(selected: readonly string[], value: string): string[] {
  return selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value]
}

function CheckboxOption({
  name,
  label,
  checked,
  onToggle,
}: {
  readonly name: string
  readonly label: string
  readonly checked: boolean
  readonly onToggle: () => void
}) {
  return (
    // O rótulo inteiro é clicável e tem 44px de altura: no celular, acertar só
    // o quadradinho de 16px é pedir demais do dedo.
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink-950">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onToggle}
        className="h-4 w-4 shrink-0 accent-ink-950"
      />
      {label}
    </label>
  )
}

function Group({
  legend,
  children,
  className,
}: {
  readonly legend: string
  readonly children: React.ReactNode
  readonly className?: string
}) {
  return (
    <fieldset className={className}>
      <legend className="eyebrow text-ink-500">{legend}</legend>
      <div className="mt-1">{children}</div>
    </fieldset>
  )
}

export function CatalogFilters({
  values,
  onChange,
  onClear,
  hasActiveFilters,
  resultCount,
}: CatalogFiltersProps) {
  const brands = useBrands()
  // Recolhido no celular: os grupos abertos empurrariam a grade de produtos
  // para fora da primeira tela. No desktop, painel lateral sempre aberto.
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-paper-line bg-paper-alt">
      <div className="flex items-center justify-between gap-3 p-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="painel-filtros"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-950"
        >
          Filtrar e ordenar
          <ChevronDownIcon className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {/*
          Região viva: quem usa leitor de tela ouve a contagem mudar sem precisar
          procurar. A cópia do rodapé do painel só aparece do lg para cima, então
          nunca existem duas contagens sendo anunciadas ao mesmo tempo.
        */}
        <p className="text-sm text-ink-500" role="status" aria-live="polite">
          {resultCount === 1 ? '1 relógio' : `${resultCount} relógios`}
        </p>
      </div>

      <div
        id="painel-filtros"
        className={cn('px-4 pb-4 lg:block lg:p-4', isOpen ? 'block' : 'hidden')}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="busca" className="eyebrow text-ink-500">
              Buscar
            </label>
            <div className="relative mt-2">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
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

          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="ordenar" className="eyebrow text-ink-500">
              Ordenar por
            </label>
            {/* Ordenação continua sendo escolha única: duas ordens ao mesmo
                tempo não existem. Só os filtros aceitam soma. */}
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

          <Group legend="Marca" className="sm:col-span-2 lg:col-span-1">
            {/* Marca nova cadastrada aparece aqui sozinha. Com muitas marcas a
                lista rola dentro do próprio bloco, sem esticar o painel. */}
            <div className="max-h-64 overflow-y-auto">
              {brands.status === 'success' &&
                brands.data.map((brand) => (
                  <CheckboxOption
                    key={brand}
                    name="marca"
                    label={brand}
                    checked={values.brands.includes(brand)}
                    onToggle={() => onChange({ brands: toggle(values.brands, brand) })}
                  />
                ))}
            </div>
          </Group>

          <Group legend="Disponibilidade">
            {availabilityOptions.map((option) => (
              <CheckboxOption
                key={option.value}
                name="disponibilidade"
                label={option.label}
                checked={values.availabilities.includes(option.value)}
                onToggle={() =>
                  onChange({ availabilities: toggle(values.availabilities, option.value) })
                }
              />
            ))}
          </Group>

          <Group legend="Condição">
            {conditionOptions.map((option) => (
              <CheckboxOption
                key={option.value}
                name="condicao"
                label={option.label}
                checked={values.conditions.includes(option.value)}
                onToggle={() => onChange({ conditions: toggle(values.conditions, option.value) })}
              />
            ))}
          </Group>
        </div>

        <div
          className={cn(
            'mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-line pt-4',
            // Sem filtro ativo o celular não tem o que mostrar aqui, e uma
            // linha divisória sozinha só suja o painel.
            hasActiveFilters ? 'flex' : 'hidden lg:flex',
          )}
        >
          <p className="hidden text-sm text-ink-500 lg:block" role="status" aria-live="polite">
            {resultCount === 1 ? '1 relógio encontrado' : `${resultCount} relógios encontrados`}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="ml-auto text-sm text-ink-950 underline underline-offset-4 transition-colors hover:text-ink-500"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

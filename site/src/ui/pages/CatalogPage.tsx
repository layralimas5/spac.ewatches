import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalog } from '@/application/use-catalog'
import type { Availability, CatalogFilters as Filters, CatalogSort, Condition } from '@/domain/watch'
import { Seo } from '@/ui/components/Seo'
import { WatchCard } from '@/ui/components/WatchCard'
import { CardSkeleton, StateMessage } from '@/ui/components/StateMessage'
import { buttonStyles } from '@/ui/components/Button'
import { WhatsAppIcon } from '@/ui/components/icons'
import { CatalogFilters, type CatalogFilterValues } from '@/ui/sections/CatalogFilters'
import { contactChannelLabel, customImportLink } from '@/lib/whatsapp'

const SORTS: readonly CatalogSort[] = ['relevancia', 'menor-preco', 'maior-preco']
const AVAILABILITIES: readonly Availability[] = ['pronta-entrega', 'sob-encomenda']
const CONDITIONS: readonly Condition[] = ['novo', 'seminovo']

function isSort(value: string): value is CatalogSort {
  return (SORTS as readonly string[]).includes(value)
}

function isAvailability(value: string): value is Availability {
  return (AVAILABILITIES as readonly string[]).includes(value)
}

function isCondition(value: string): value is Condition {
  return (CONDITIONS as readonly string[]).includes(value)
}

/**
 * Grupo com várias opções vira parâmetro repetido: `?marca=Rolex&marca=Tudor`.
 * É o formato que `URLSearchParams` já lê e escreve, sem inventar separador.
 */
function replaceAll(params: URLSearchParams, key: string, values: readonly string[]): void {
  params.delete(key)
  for (const value of values) params.append(key, value)
}

export default function CatalogPage() {
  // Os filtros moram na URL: link compartilhável, botão voltar funcionando e estado que sobrevive ao reload.
  const [searchParams, setSearchParams] = useSearchParams()

  const values = useMemo<CatalogFilterValues>(() => {
    const sortParam = searchParams.get('ordenar') ?? ''
    return {
      query: searchParams.get('q') ?? '',
      brands: searchParams.getAll('marca'),
      availabilities: searchParams.getAll('disponibilidade'),
      conditions: searchParams.getAll('condicao'),
      sort: isSort(sortParam) ? sortParam : 'relevancia',
    }
  }, [searchParams])

  const filters = useMemo<Filters>(() => {
    // A URL é digitável, então lixo pode chegar aqui. O que não for valor
    // conhecido é descartado em vez de zerar a vitrine.
    const availabilities = values.availabilities.filter(isAvailability)
    const conditions = values.conditions.filter(isCondition)

    return {
      ...(values.query !== '' && { query: values.query }),
      ...(values.brands.length > 0 && { brands: values.brands }),
      ...(availabilities.length > 0 && { availabilities }),
      ...(conditions.length > 0 && { conditions }),
    }
  }, [values])

  const state = useCatalog(filters, values.sort)

  const handleChange = useCallback(
    (patch: Partial<CatalogFilterValues>) => {
      const next = new URLSearchParams(searchParams)

      if (patch.query !== undefined) {
        if (patch.query === '') next.delete('q')
        else next.set('q', patch.query)
      }

      if (patch.sort !== undefined) {
        // Relevância é o padrão e não precisa sujar a URL.
        if (patch.sort === 'relevancia') next.delete('ordenar')
        else next.set('ordenar', patch.sort)
      }

      if (patch.brands !== undefined) replaceAll(next, 'marca', patch.brands)
      if (patch.availabilities !== undefined)
        replaceAll(next, 'disponibilidade', patch.availabilities)
      if (patch.conditions !== undefined) replaceAll(next, 'condicao', patch.conditions)

      // `replace` para digitar na busca não encher o histórico de entradas.
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const handleClear = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const hasActiveFilters =
    values.query !== '' ||
    values.brands.length > 0 ||
    values.availabilities.length > 0 ||
    values.conditions.length > 0 ||
    values.sort !== 'relevancia'

  const resultCount = state.status === 'success' ? state.data.length : 0

  return (
    <>
      <Seo
        title="Catálogo de relógios importados"
        description="Relógios importados originais em pronta-entrega e sob encomenda, com caixa e documentos. Filtre por marca, condição e disponibilidade."
        path="/catalogo"
      />

      <div className="container-brand py-8 sm:py-10">
        <nav aria-label="Trilha de navegação" className="text-xs text-ink-500">
          <ol className="flex list-none flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-ink-950">
                Início
              </a>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-ink-950" aria-current="page">
              Relógios
            </li>
          </ol>
        </nav>

        <header className="mt-4 max-w-2xl">
          <h1 className="text-2xl text-ink-950 sm:text-3xl">Relógios</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            O que está em mãos e o que dá pra trazer sob encomenda. Não achou o seu modelo? A gente importa.
          </p>
        </header>

        {/* Filtros na lateral no desktop, empilhados no celular, o padrão de
            listagem de e-commerce, que deixa a grade ocupar a largura útil. */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CatalogFilters
              values={values}
              onChange={handleChange}
              onClear={handleClear}
              hasActiveFilters={hasActiveFilters}
              resultCount={resultCount}
            />
          </aside>

          <div>
          {state.status === 'loading' && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}

          {state.status === 'error' && (
            <StateMessage
              tone="error"
              title="Não consegui carregar o catálogo"
              description="Algo falhou ao buscar as peças. Tente recarregar a página, se continuar, fale com a gente que resolvemos por lá."
              action={
                <a
                  href={customImportLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles('outline', 'md')}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {`Falar no ${contactChannelLabel()}`}
                </a>
              }
            />
          )}

          {state.status === 'success' && state.data.length === 0 && (
            <StateMessage
              title="Nenhum relógio com esses filtros"
              description="Limpe os filtros para ver o catálogo inteiro, ou peça direto o modelo que você procura, que a gente cota a importação."
              action={
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={handleClear} className={buttonStyles('outline', 'md')}>
                    Limpar filtros
                  </button>
                  <a
                    href={customImportLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles('primary', 'md')}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Pedir por encomenda
                  </a>
                </div>
              }
            />
          )}

          {state.status === 'success' && state.data.length > 0 && (
            <ul className="grid list-none grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {state.data.map((watch, index) => (
                <li key={watch.id}>
                  <WatchCard watch={watch} priority={index === 0} />
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </div>
    </>
  )
}

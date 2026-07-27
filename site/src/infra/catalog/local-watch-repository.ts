import {
  isSoldOut,
  matchesFilters,
  primaryImage,
  sortWatches,
  type CatalogCategory,
  type CatalogFilters,
  type CatalogSort,
  type Watch,
} from '@/domain/watch'
import type { WatchRepository } from '@/domain/watch-repository'
import { demoWatches } from './watches.data'

/**
 * Implementação do catálogo em memória, a partir de um arquivo tipado.
 *
 * É a fonte de dados enquanto não há banco. Para migrar pro Supabase, criar um
 * `SupabaseWatchRepository` que satisfaça a mesma interface e trocar a instância
 * exportada em `infra/catalog/index.ts`, nenhum componente precisa mudar.
 */
export class LocalWatchRepository implements WatchRepository {
  private readonly watches: readonly Watch[]

  constructor(watches: readonly Watch[] = demoWatches) {
    this.watches = watches
  }

  async list(params?: { filters?: CatalogFilters; sort?: CatalogSort }): Promise<Watch[]> {
    const filters = params?.filters ?? {}
    const filtered = this.watches.filter((watch) => matchesFilters(watch, filters))
    return sortWatches(filtered, params?.sort ?? 'relevancia')
  }

  async findById(id: string): Promise<Watch | null> {
    return this.watches.find((watch) => watch.id === id) ?? null
  }

  async listFeatured(limit = 3): Promise<Watch[]> {
    return this.watches.filter((watch) => watch.featured).slice(0, limit)
  }

  async listBrands(): Promise<string[]> {
    return [...new Set(this.watches.map((watch) => watch.brand))].sort((a, b) =>
      a.localeCompare(b, 'pt-BR'),
    )
  }

  async listCategories(): Promise<CatalogCategory[]> {
    const byBrand = new Map<string, Watch[]>()

    for (const watch of this.watches) {
      const pieces = byBrand.get(watch.brand) ?? []
      pieces.push(watch)
      byBrand.set(watch.brand, pieces)
    }

    return [...byBrand.entries()]
      .map(([brand, pieces]) => {
        // A capa prefere peça disponível: categoria ilustrada por algo esgotado
        // convida para uma vitrine que decepciona.
        const cover =
          pieces.find((piece) => !isSoldOut(piece) && primaryImage(piece) !== undefined) ??
          pieces.find((piece) => primaryImage(piece) !== undefined)
        const image = cover === undefined ? undefined : primaryImage(cover)

        return {
          brand,
          count: pieces.length,
          ...(image !== undefined && { image }),
        }
      })
      .sort((a, b) => a.brand.localeCompare(b.brand, 'pt-BR'))
  }

  async listRelated(watchId: string, limit = 3): Promise<Watch[]> {
    const current = this.watches.find((watch) => watch.id === watchId)
    if (current === undefined) return []

    const sameBrand = this.watches.filter(
      (watch) => watch.id !== watchId && watch.brand === current.brand,
    )
    const others = this.watches.filter(
      (watch) => watch.id !== watchId && watch.brand !== current.brand,
    )

    // Completa com outras marcas se a mesma marca não encher a prateleira.
    return [...sameBrand, ...others].slice(0, limit)
  }
}

import { watchRepository } from '@/infra/catalog'
import type { CatalogCategory, CatalogFilters, CatalogSort, Watch } from '@/domain/watch'
import { useAsync, type AsyncState } from './use-async'

export function useCatalog(filters: CatalogFilters, sort: CatalogSort): AsyncState<Watch[]> {
  return useAsync(
    () => watchRepository.list({ filters, sort }),
    `catalog:${JSON.stringify(filters)}:${sort}`,
  )
}

export function useFeaturedWatches(limit = 3): AsyncState<Watch[]> {
  return useAsync(() => watchRepository.listFeatured(limit), `featured:${limit}`)
}

export function useWatch(id: string | undefined): AsyncState<Watch | null> {
  return useAsync(
    () => (id === undefined ? Promise.resolve(null) : watchRepository.findById(id)),
    `watch:${id ?? ''}`,
  )
}

export function useRelatedWatches(id: string | undefined, limit = 3): AsyncState<Watch[]> {
  return useAsync(
    () => (id === undefined ? Promise.resolve([]) : watchRepository.listRelated(id, limit)),
    `related:${id ?? ''}:${limit}`,
  )
}

export function useBrands(): AsyncState<string[]> {
  return useAsync(() => watchRepository.listBrands(), 'brands')
}

export function useCategories(): AsyncState<CatalogCategory[]> {
  return useAsync(() => watchRepository.listCategories(), 'categories')
}

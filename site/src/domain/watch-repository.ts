import type { CatalogCategory, CatalogFilters, CatalogSort, Watch } from './watch'

/**
 * Contrato de acesso ao catálogo.
 *
 * A UI depende SÓ desta interface. Hoje quem implementa é o catálogo local
 * (`infra/catalog/local-watch-repository.ts`); quando o Supabase entrar, basta
 * uma nova implementação, nenhuma página muda.
 *
 * Assinatura assíncrona de propósito: o catálogo local resolve na hora, mas
 * manter a Promise evita reescrever toda a UI na migração.
 */
export interface WatchRepository {
  list(params?: { filters?: CatalogFilters; sort?: CatalogSort }): Promise<Watch[]>
  findById(id: string): Promise<Watch | null>
  listFeatured(limit?: number): Promise<Watch[]>
  /** Marcas distintas presentes no catálogo, ordenadas, alimenta o filtro. */
  listBrands(): Promise<string[]>
  /** Marcas com capa e contagem, alimenta o bloco de categorias da home. */
  listCategories(): Promise<CatalogCategory[]>
  /** Outros modelos da mesma marca, excluindo o atual. */
  listRelated(watchId: string, limit?: number): Promise<Watch[]>
}

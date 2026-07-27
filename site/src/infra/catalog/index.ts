import type { WatchRepository } from '@/domain/watch-repository'
import { LocalWatchRepository } from './local-watch-repository'

/**
 * Único ponto do app que escolhe a implementação do catálogo.
 * Trocar por `new SupabaseWatchRepository(client)` na migração, só esta linha muda.
 */
export const watchRepository: WatchRepository = new LocalWatchRepository()

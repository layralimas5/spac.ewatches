import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { WatchImage } from '@/domain/watch'
import { WatchIcon } from './icons'

interface WatchPhotoProps {
  readonly image: WatchImage | undefined
  readonly className?: string
  /** `eager` só na primeira imagem visível (LCP). O resto entra sob demanda. */
  readonly loading?: 'lazy' | 'eager'
  readonly sizes?: string
}

/**
 * Foto de relógio com degradação elegante.
 *
 * Enquanto o catálogo real não tem fotos, o arquivo não existe e o `onError`
 * cai no marcador da marca — melhor que ícone de imagem quebrada, e o layout
 * não pula porque o espaço é reservado pelo aspect-ratio do container.
 */
export function WatchPhoto({ image, className, loading = 'lazy', sizes }: WatchPhotoProps) {
  const [failed, setFailed] = useState(false)
  const showPlaceholder = image === undefined || failed

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-3',
          'bg-gradient-to-br from-ink-800 to-ink-950',
          className,
        )}
        role="img"
        aria-label={image?.alt ?? 'Foto do relógio ainda não cadastrada'}
      >
        <WatchIcon className="h-10 w-10 text-gold-600/50" />
        <span className="eyebrow text-ink-700">Space Watches</span>
      </div>
    )
  }

  return (
    <img
      src={image.url}
      alt={image.alt}
      loading={loading}
      decoding="async"
      sizes={sizes}
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}

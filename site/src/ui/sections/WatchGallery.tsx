import { useState } from 'react'
import type { WatchImage } from '@/domain/watch'
import { WatchPhoto } from '@/ui/components/WatchPhoto'
import { cn } from '@/lib/cn'

export function WatchGallery({
  images,
  name,
}: {
  readonly images: readonly WatchImage[]
  readonly name: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex]

  return (
    <div className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-md border border-paper-line bg-paper-alt">
        <div className="aspect-square">
          {/* `eager` de propósito: esta é a maior imagem da página e define o LCP. */}
          <WatchPhoto image={active} loading="eager" sizes="(min-width: 1024px) 560px, 92vw" />
        </div>
      </div>

      {images.length > 1 && (
        <ul className="mt-4 grid list-none grid-cols-5 gap-3">
          {images.map((image, index) => (
            <li key={image.url}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver foto ${index + 1} de ${images.length} do ${name}`}
                aria-current={index === activeIndex}
                className={cn(
                  'aspect-square w-full overflow-hidden rounded-lg border bg-paper-alt transition-colors',
                  index === activeIndex
                    ? 'border-ink-950'
                    : 'border-paper-line hover:border-ink-500/40',
                )}
              >
                <WatchPhoto image={image} sizes="96px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { isDiscounted, primaryImage, type Watch } from '@/domain/watch'
import { formatPrice } from '@/lib/format'
import { AvailabilityBadge } from './AvailabilityBadge'
import { WatchPhoto } from './WatchPhoto'

interface WatchCardProps {
  readonly watch: Watch
  /** `true` apenas no primeiro card da primeira dobra, para não atrasar o LCP. */
  readonly priority?: boolean
}

export function WatchCard({ watch, priority = false }: WatchCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-ink-700 bg-ink-900 transition-colors duration-300 hover:border-gold-600/50">
      <div className="relative aspect-4/5 overflow-hidden bg-ink-800">
        <WatchPhoto
          image={primaryImage(watch)}
          loading={priority ? 'eager' : 'lazy'}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        />
        <AvailabilityBadge availability={watch.availability} className="absolute left-3 top-3" />
      </div>

      <div className="p-5">
        <p className="eyebrow text-muted">{watch.brand}</p>

        <h3 className="mt-2 font-display text-lg leading-snug text-cream">
          {/* O link cobre o card inteiro, mas o nome continua sendo o rótulo lido em voz alta. */}
          <Link to={`/relogio/${watch.id}`} className="after:absolute after:inset-0 after:content-['']">
            {watch.name}
          </Link>
        </h3>

        <p className="mt-1 text-sm text-muted">
          {watch.condition === 'novo' ? 'Novo' : 'Seminovo'}
          {watch.reference !== undefined && ` · Ref. ${watch.reference}`}
        </p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-lg font-medium text-cream">{formatPrice(watch.price)}</span>
          {isDiscounted(watch) && watch.previousPrice !== undefined && (
            <span className="text-sm text-muted line-through">{formatPrice(watch.previousPrice)}</span>
          )}
        </div>
      </div>
    </article>
  )
}

import { cn } from '@/lib/cn'

/**
 * Marca escrita "Space Watches".
 * O handle `spac.ewatches` é só do Instagram e nunca aparece como nome.
 */
export function Logo({ className }: { readonly className?: string }) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className="font-display text-xl leading-none tracking-tight text-cream">Space</span>
      <span className="eyebrow text-gold-500">Watches</span>
    </span>
  )
}

import { Link } from 'react-router-dom'
import {
  discountPercent,
  isDiscounted,
  isSoldOut,
  primaryImage,
  type Watch,
} from '@/domain/watch'
import { formatInstallment, formatPrice } from '@/lib/format'
import { useCart } from '@/application/use-cart'
import { siteConfig } from '@/config/site.config'
import { WatchPhoto } from './WatchPhoto'
import { ColorSwatches } from './ColorSwatches'

interface WatchCardProps {
  readonly watch: Watch
  /** `true` apenas no primeiro card da primeira dobra, para não atrasar o LCP. */
  readonly priority?: boolean
}

/**
 * Card no formato de e-commerce: foto, nome, desconto, preço, parcelamento e
 * botão de compra. A densidade é proposital, quem navega catálogo compara
 * preço entre peças, e esconder o valor atrás de um clique atrapalha isso.
 */
export function WatchCard({ watch, priority = false }: WatchCardProps) {
  const { add } = useCart()
  const discount = discountPercent(watch)
  const soldOut = isSoldOut(watch)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-paper-line bg-paper transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(13,13,16,0.08)]">
      {/* Fundo branco, e não cinza: foto de catálogo costuma vir em PNG com
          fundo transparente, e o cinza aparecia como um quadrado atrás da peça. */}
      <div className="relative aspect-square overflow-hidden bg-paper">
        {/*
          O respiro em volta é o que dá ar ao card: a peça ocupa o quadrado com
          folga em vez de encostar nas bordas. O `padding` fica no link e não no
          quadro, então os selos continuam grudados no canto.
        */}
        <Link
          to={`/relogio/${watch.id}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full p-6 sm:p-7"
        >
          <WatchPhoto
            image={primaryImage(watch)}
            fit="contain"
            loading={priority ? 'eager' : 'lazy'}
            sizes="(min-width: 1280px) 220px, (min-width: 768px) 25vw, 40vw"
            // Peça esgotada não pulsa: chamar atenção para o que não dá pra
            // comprar é o oposto do que o card precisa fazer.
            className={soldOut ? 'opacity-60' : 'hover-pulse'}
          />
        </Link>

        {discount !== null && !soldOut && (
          <span className="absolute left-2 top-2 rounded bg-success px-2 py-1 text-[0.6875rem] font-semibold text-cream">
            {`-${discount}% OFF`}
          </span>
        )}

        {soldOut && (
          <span className="absolute left-2 top-2 rounded bg-danger px-2 py-1 text-[0.6875rem] font-semibold text-cream">
            Esgotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="eyebrow text-ink-500">{watch.brand}</p>

        <h3 className="mt-1 text-sm leading-snug font-medium text-ink-950">
          <Link to={`/relogio/${watch.id}`} className="hover:underline hover:underline-offset-2">
            {watch.name}
          </Link>
        </h3>

        {watch.colors !== undefined && <ColorSwatches colors={watch.colors} className="mt-2" />}

        {/* `mt-auto` gruda o bloco de preço na base: cards de alturas diferentes
            mantêm preço e botão alinhados na mesma linha da grade. */}
        <div className="mt-auto pt-3">
          {isDiscounted(watch) && watch.previousPrice !== undefined && (
            <p className="text-xs text-ink-500 line-through">{formatPrice(watch.previousPrice)}</p>
          )}

          <p className="text-base font-semibold text-ink-950">{formatPrice(watch.price)}</p>

          <p className="mt-0.5 text-xs text-ink-500">
            {formatInstallment(watch.price, siteConfig.installments)}
          </p>

          {soldOut ? (
            <Link
              to={`/relogio/${watch.id}`}
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md border border-paper-line text-xs font-semibold text-ink-500 transition-colors hover:border-ink-950 hover:text-ink-950 sm:h-10"
            >
              Ver detalhes
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => add(watch)}
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md bg-ink-950 text-xs font-semibold text-paper transition-colors hover:bg-ink-800 sm:h-10"
            >
              Comprar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

import { Link, useParams } from 'react-router-dom'
import { useRelatedWatches, useWatch } from '@/application/use-catalog'
import { isDiscounted, type Watch } from '@/domain/watch'
import { formatInstallment, formatPrice } from '@/lib/format'
import { contactChannelLabel, watchInquiryLink } from '@/lib/whatsapp'
import { watchStructuredData } from '@/lib/structured-data'
import { Seo } from '@/ui/components/Seo'
import { buttonStyles } from '@/ui/components/Button'
import { AvailabilityBadge } from '@/ui/components/AvailabilityBadge'
import { WatchCard } from '@/ui/components/WatchCard'
import { CardSkeleton, StateMessage } from '@/ui/components/StateMessage'
import { WatchGallery } from '@/ui/sections/WatchGallery'
import { BoxIcon, CheckIcon, ShieldIcon, WhatsAppIcon } from '@/ui/components/icons'

export default function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const state = useWatch(id)

  if (state.status === 'loading') {
    return (
      <div className="container-brand py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-ink-900" />
          <div className="space-y-4">
            <div className="h-3 w-24 animate-pulse rounded bg-ink-900" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-ink-900" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-ink-900" />
          </div>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="container-brand py-20">
        <StateMessage
          tone="error"
          title="Não consegui carregar este relógio"
          description="Algo falhou ao buscar os dados da peça. Volte ao catálogo e tente de novo."
          action={
            <Link to="/catalogo" className={buttonStyles('outline', 'md')}>
              Voltar ao catálogo
            </Link>
          }
        />
      </div>
    )
  }

  if (state.data === null) {
    return (
      <div className="container-brand py-20">
        <Seo
          title="Relógio não encontrado"
          description="Esta peça não está mais disponível no catálogo da Space Watches."
          path={`/relogio/${id ?? ''}`}
        />
        <StateMessage
          title="Esta peça não está mais no catálogo"
          description="Pode ter sido vendida ou saído de linha. Veja o que temos hoje — ou peça esse modelo por encomenda."
          action={
            <Link to="/catalogo" className={buttonStyles('primary', 'md')}>
              Ver catálogo
            </Link>
          }
        />
      </div>
    )
  }

  return <WatchDetail watch={state.data} />
}

function WatchDetail({ watch }: { readonly watch: Watch }) {
  const related = useRelatedWatches(watch.id, 3)
  const fullName = `${watch.brand} ${watch.name}`

  const specs: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Movimento', value: watch.specs.movement },
    { label: 'Caixa', value: watch.specs.caseMaterial },
    { label: 'Diâmetro', value: `${watch.specs.caseSizeMm} mm` },
    { label: 'Vidro', value: watch.specs.glass },
    { label: 'Resistência à água', value: watch.specs.waterResistance },
    { label: 'Pulseira', value: watch.specs.bracelet },
  ]

  return (
    <>
      <Seo
        title={fullName}
        description={watch.shortDescription}
        path={`/relogio/${watch.id}`}
        type="product"
        structuredData={watchStructuredData(watch)}
      />

      <div className="container-brand py-8 sm:py-12">
        <nav aria-label="Trilha de navegação" className="text-sm text-muted">
          <ol className="flex list-none flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="transition-colors hover:text-cream">
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/catalogo" className="transition-colors hover:text-cream">
                Catálogo
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-cream" aria-current="page">
              {fullName}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <WatchGallery images={watch.images} name={fullName} />

          <div>
            <AvailabilityBadge availability={watch.availability} />

            <p className="eyebrow mt-5 text-muted">{watch.brand}</p>
            <h1 className="mt-2 font-display text-3xl leading-tight text-cream sm:text-4xl">
              {watch.name}
            </h1>

            <p className="mt-3 text-sm text-muted">
              {watch.condition === 'novo' ? 'Novo' : 'Seminovo'}
              {watch.reference !== undefined && ` · Ref. ${watch.reference}`}
            </p>

            <div className="mt-8 border-y border-ink-700 py-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl text-cream">{formatPrice(watch.price)}</span>
                {isDiscounted(watch) && watch.previousPrice !== undefined && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(watch.previousPrice)}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted">
                {`ou ${formatInstallment(watch.price, 12)} — condições confirmadas no atendimento`}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href={watchInquiryLink(watch)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonStyles('primary', 'lg')} w-full`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                {watch.availability === 'pronta-entrega'
                  ? `Quero este relógio`
                  : `Pedir por encomenda`}
              </a>
              <p className="text-center text-xs text-muted">
                {`Abre uma conversa no ${contactChannelLabel()} com o modelo já preenchido.`}
              </p>
            </div>

            <ul className="mt-8 grid list-none gap-3 sm:grid-cols-2">
              {watch.hasBoxAndPapers && (
                <li className="flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-900 p-4">
                  <BoxIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <span className="text-sm text-muted">Acompanha caixa e documentos originais</span>
                </li>
              )}
              <li className="flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-900 p-4">
                <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                <span className="text-sm text-muted">
                  {`Garantia de ${watch.warrantyMonths} meses`}
                </span>
              </li>
            </ul>

            <div className="mt-10">
              <h2 className="font-display text-xl text-cream">Sobre esta peça</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{watch.description}</p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-xl text-cream">Ficha técnica</h2>
              <dl className="mt-4 divide-y divide-ink-700 border-y border-ink-700">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-6 py-3">
                    <dt className="text-sm text-muted">{spec.label}</dt>
                    <dd className="text-right text-sm text-cream">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <section className="mt-24" aria-labelledby="relacionados">
          <h2 id="relacionados" className="font-display text-2xl text-cream sm:text-3xl">
            Você também pode gostar
          </h2>

          <div className="mt-8">
            {related.status === 'loading' && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            )}

            {related.status === 'success' && related.data.length > 0 && (
              <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.data.map((item) => (
                  <li key={item.id}>
                    <WatchCard watch={item} />
                  </li>
                ))}
              </ul>
            )}

            {related.status === 'success' && related.data.length === 0 && (
              <p className="text-sm text-muted">
                Nenhuma outra peça no catálogo por enquanto.{' '}
                <Link to="/importacao" className="text-gold-400 hover:text-gold-500">
                  Peça por encomenda
                </Link>
                .
              </p>
            )}
          </div>
        </section>

        <p className="mt-12 flex items-center justify-center gap-2 text-sm text-muted">
          <CheckIcon className="h-4 w-4 text-gold-500" />
          Procedência verificada antes de qualquer venda.
        </p>
      </div>
    </>
  )
}

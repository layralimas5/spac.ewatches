import { Link, useParams } from 'react-router-dom'
import { useRelatedWatches, useWatch } from '@/application/use-catalog'
import { isDiscounted, type Watch } from '@/domain/watch'
import { formatInstallment, formatPrice } from '@/lib/format'
import { contactChannelLabel, watchInquiryLink } from '@/lib/whatsapp'
import { watchStructuredData } from '@/lib/structured-data'
import { siteConfig } from '@/config/site.config'
import { Seo } from '@/ui/components/Seo'
import { buttonStyles } from '@/ui/components/Button'
import { AvailabilityBadge } from '@/ui/components/AvailabilityBadge'
import { WatchCard } from '@/ui/components/WatchCard'
import { CardSkeleton, StateMessage } from '@/ui/components/StateMessage'
import { WatchGallery } from '@/ui/sections/WatchGallery'
import { BoxIcon, CheckIcon, GlobeIcon, ShieldIcon, WhatsAppIcon } from '@/ui/components/icons'

export default function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const state = useWatch(id)

  if (state.status === 'loading') {
    return (
      <div className="container-brand py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-paper-alt" />
          <div className="space-y-4">
            <div className="h-3 w-24 animate-pulse rounded bg-paper-alt" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-paper-alt" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-paper-alt" />
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
            <Link to="/catalogo" className={buttonStyles('outline-light', 'md')}>
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
  const isReadyToShip = watch.availability === 'pronta-entrega'

  const specs: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Movimento', value: watch.specs.movement },
    { label: 'Caixa', value: watch.specs.caseMaterial },
    { label: 'Diâmetro', value: `${watch.specs.caseSizeMm} mm` },
    { label: 'Vidro', value: watch.specs.glass },
    { label: 'Resistência à água', value: watch.specs.waterResistance },
    { label: 'Pulseira', value: watch.specs.bracelet },
  ]

  const guarantees = [
    ...(watch.hasBoxAndPapers
      ? [{ icon: BoxIcon, text: 'Caixa e documentos originais acompanham a peça' }]
      : []),
    { icon: ShieldIcon, text: `Garantia de ${watch.warrantyMonths} meses` },
    { icon: CheckIcon, text: 'Procedência verificada antes da entrega' },
    isReadyToShip
      ? { icon: GlobeIcon, text: 'Em mãos — envio combinado no atendimento' }
      : { icon: GlobeIcon, text: 'Importação sob encomenda, com prazo fechado antes' },
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

      <div className="container-brand pt-6 pb-8 sm:pt-8">
        <nav aria-label="Trilha de navegação" className="text-sm text-ink-500">
          <ol className="flex list-none flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="transition-colors hover:text-ink-950">
                Início
              </Link>
            </li>
            <li aria-hidden="true" className="text-paper-line">
              /
            </li>
            <li>
              <Link to="/catalogo" className="transition-colors hover:text-ink-950">
                Catálogo
              </Link>
            </li>
            <li aria-hidden="true" className="text-paper-line">
              /
            </li>
            <li className="text-ink-950" aria-current="page">
              {fullName}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <WatchGallery images={watch.images} name={fullName} />

          <div className="lg:py-2">
            <AvailabilityBadge availability={watch.availability} />

            <p className="eyebrow mt-6 text-gold-700">{watch.brand}</p>
            <h1 className="mt-2 font-display text-4xl leading-[1.1] text-ink-950 sm:text-5xl">
              {watch.name}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-ink-500">{watch.shortDescription}</p>

            <p className="mt-4 flex flex-wrap items-center gap-x-3 text-sm text-ink-500">
              <span>{watch.condition === 'novo' ? 'Novo' : 'Seminovo'}</span>
              {watch.reference !== undefined && (
                <>
                  <span aria-hidden="true" className="text-paper-line">
                    ·
                  </span>
                  <span>{`Ref. ${watch.reference}`}</span>
                </>
              )}
            </p>

            {/* Preço numa superfície própria: é o que o visitante procura primeiro
                e não pode se perder no meio do texto corrido. */}
            <div className="mt-8 rounded-2xl border border-paper-line bg-paper-alt p-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-4xl text-ink-950">
                  {formatPrice(watch.price)}
                </span>
                {isDiscounted(watch) && watch.previousPrice !== undefined && (
                  <span className="text-base text-ink-500 line-through">
                    {formatPrice(watch.previousPrice)}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-ink-500">
                {`ou ${formatInstallment(watch.price, siteConfig.installments)} — condições confirmadas no atendimento`}
              </p>

              <a
                href={watchInquiryLink(watch)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonStyles('primary', 'lg')} mt-6 w-full`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                {isReadyToShip ? 'Quero este relógio' : 'Pedir por encomenda'}
              </a>

              <p className="mt-3 text-center text-xs text-ink-500">
                {`Abre uma conversa no ${contactChannelLabel()} com o modelo já preenchido.`}
              </p>
            </div>

            <ul className="mt-8 list-none divide-y divide-paper-line border-y border-paper-line">
              {guarantees.map((item) => (
                <li key={item.text} className="flex items-center gap-3 py-3.5">
                  <item.icon className="h-5 w-5 shrink-0 text-gold-600" />
                  <span className="text-sm text-ink-500">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <h2 className="font-display text-2xl text-ink-950">Sobre esta peça</h2>
              <p className="mt-3 leading-relaxed text-ink-500">{watch.description}</p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl text-ink-950">Ficha técnica</h2>
              <dl className="mt-5 grid gap-x-8 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-4 border-b border-paper-line py-3"
                  >
                    <dt className="eyebrow text-ink-500">{spec.label}</dt>
                    <dd className="text-right text-sm text-ink-950">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Faixa escura fechando a página: repete a promessa que sustenta a venda
          de importado bem na hora da decisão. */}
      <section className="mt-16 bg-ink-950 text-cream" aria-label="Nossa garantia">
        <div className="container-brand grid gap-8 py-14 sm:grid-cols-3">
          {[
            {
              icon: ShieldIcon,
              title: 'Original, sempre',
              text: 'Sem réplica. Se não for original, não entra no catálogo.',
            },
            {
              icon: BoxIcon,
              title: 'Completo',
              text: 'Caixa e documentos que comprovam a procedência.',
            },
            {
              icon: WhatsAppIcon,
              title: 'Atendimento direto',
              text: 'Você fala com quem vende, não com um robô.',
            },
          ].map((item) => (
            <div key={item.title}>
              <item.icon className="h-6 w-6 text-gold-500" />
              <h2 className="mt-4 font-display text-lg text-cream">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-brand py-16 sm:py-20" aria-labelledby="relacionados">
        <h2 id="relacionados" className="font-display text-2xl text-ink-950 sm:text-3xl">
          Você também pode gostar
        </h2>

        <div className="mt-8">
          {related.status === 'loading' && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}

          {related.status === 'success' && related.data.length > 0 && (
            <ul className="grid list-none grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
              {related.data.map((item) => (
                <li key={item.id}>
                  <WatchCard watch={item} />
                </li>
              ))}
            </ul>
          )}

          {related.status === 'success' && related.data.length === 0 && (
            <p className="text-sm text-ink-500">
              Nenhuma outra peça no catálogo por enquanto.{' '}
              <Link to="/importacao" className="text-gold-700 hover:text-gold-600">
                Peça por encomenda
              </Link>
              .
            </p>
          )}
        </div>
      </section>
    </>
  )
}

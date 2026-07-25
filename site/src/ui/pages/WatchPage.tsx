import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRelatedWatches, useWatch } from '@/application/use-catalog'
import { useCart } from '@/application/use-cart'
import {
  discountPercent,
  isDiscounted,
  isLastUnit,
  isSoldOut,
  type Watch,
} from '@/domain/watch'
import { formatInstallment, formatPrice } from '@/lib/format'
import { contactChannelLabel, watchInquiryLink } from '@/lib/whatsapp'
import { watchStructuredData } from '@/lib/structured-data'
import { siteConfig } from '@/config/site.config'
import { PIX_DISCOUNT_PERCENT } from '@/config/commerce'
import { Seo } from '@/ui/components/Seo'
import { buttonStyles } from '@/ui/components/Button'
import { QuantityStepper } from '@/ui/components/QuantityStepper'
import { WatchCard } from '@/ui/components/WatchCard'
import { CardSkeleton, StateMessage } from '@/ui/components/StateMessage'
import { WatchGallery } from '@/ui/sections/WatchGallery'
import { ShippingCalculator } from '@/ui/sections/ShippingCalculator'
import { InstallmentTable } from '@/ui/sections/InstallmentTable'
import { BoxIcon, CheckIcon, ShieldIcon, WhatsAppIcon } from '@/ui/components/icons'

export default function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const state = useWatch(id)

  if (state.status === 'loading') {
    return (
      <div className="container-brand py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-paper-alt" />
          <div className="space-y-4">
            <div className="h-3 w-24 animate-pulse rounded bg-paper-alt" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-paper-alt" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-paper-alt" />
            <div className="h-12 w-full animate-pulse rounded bg-paper-alt" />
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
  const related = useRelatedWatches(watch.id, 4)
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)

  const fullName = `${watch.brand} ${watch.name}`
  const soldOut = isSoldOut(watch)
  const discount = discountPercent(watch)
  const pixPrice = Math.round(watch.price * (1 - PIX_DISCOUNT_PERCENT / 100))

  const specs: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Movimento', value: watch.specs.movement },
    { label: 'Caixa', value: watch.specs.caseMaterial },
    { label: 'Diâmetro da caixa', value: `${watch.specs.caseSizeMm} mm` },
    { label: 'Vidro', value: watch.specs.glass },
    { label: 'Resistência à água', value: watch.specs.waterResistance },
    { label: 'Pulseira', value: watch.specs.bracelet },
    { label: 'Condição', value: watch.condition === 'novo' ? 'Novo' : 'Seminovo' },
    { label: 'Garantia', value: `${watch.warrantyMonths} meses` },
    ...(watch.reference !== undefined
      ? [{ label: 'Referência', value: watch.reference }]
      : []),
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

      <div className="container-brand py-6">
        <nav aria-label="Trilha de navegação" className="text-xs text-ink-500">
          <ol className="flex list-none flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-ink-950">
                Início
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link to="/catalogo" className="hover:text-ink-950">
                Relógios
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link
                to={`/catalogo?marca=${encodeURIComponent(watch.brand)}`}
                className="hover:text-ink-950"
              >
                {watch.brand}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-ink-950" aria-current="page">
              {watch.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_26rem] lg:gap-12">
          <WatchGallery images={watch.images} name={fullName} />

          <div>
            <p className="eyebrow text-ink-500">{watch.brand}</p>
            <h1 className="mt-1.5 text-2xl leading-tight text-ink-950 sm:text-3xl">{watch.name}</h1>
            <p className="mt-2 text-xs text-ink-500">{`SKU: ${watch.sku}`}</p>

            {soldOut && (
              <p className="mt-4 inline-block rounded bg-ink-500 px-2.5 py-1 text-xs font-semibold text-cream">
                Esgotado
              </p>
            )}

            {!soldOut && isLastUnit(watch) && (
              <p className="mt-4 rounded-md bg-paper-alt px-3 py-2 text-sm text-ink-950">
                Atenção: última unidade disponível.
              </p>
            )}

            <div className="mt-5">
              {isDiscounted(watch) && watch.previousPrice !== undefined && (
                <p className="flex items-center gap-2">
                  <span className="text-sm text-ink-500 line-through">
                    {formatPrice(watch.previousPrice)}
                  </span>
                  {discount !== null && (
                    <span className="rounded bg-ink-950 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-cream">
                      {`-${discount}% OFF`}
                    </span>
                  )}
                </p>
              )}

              <p className="mt-1 text-3xl font-semibold text-ink-950">
                {formatPrice(watch.price)}
              </p>

              <p className="mt-1 text-sm text-ink-500">
                {`ou ${formatInstallment(watch.price, siteConfig.installments)} sem juros`}
              </p>

              {PIX_DISCOUNT_PERCENT > 0 && (
                <p className="mt-1 text-sm font-medium text-gold-700">
                  {`${formatPrice(pixPrice)} no Pix (${PIX_DISCOUNT_PERCENT}% de desconto)`}
                </p>
              )}
            </div>

            <div className="mt-4">
              <InstallmentTable price={watch.price} />
            </div>

            {soldOut ? (
              <div className="mt-6 rounded-lg border border-paper-line bg-paper-alt p-4">
                <p className="text-sm text-ink-950">Esta peça está esgotada.</p>
                <p className="mt-1 text-sm text-ink-500">
                  Podemos trazer o mesmo modelo por importação sob encomenda.
                </p>
                <a
                  href={watchInquiryLink(watch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonStyles('primary', 'md')} mt-4 w-full`}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {`Pedir por encomenda no ${contactChannelLabel()}`}
                </a>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <QuantityStepper
                    value={quantity}
                    max={watch.stock}
                    onChange={setQuantity}
                    label={watch.name}
                  />
                  <span className="text-xs text-ink-500">
                    {`${watch.stock} ${watch.stock === 1 ? 'unidade' : 'unidades'} em estoque`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => add(watch, quantity)}
                  className={`${buttonStyles('primary', 'lg')} mt-3 w-full`}
                >
                  Comprar
                </button>

                <a
                  href={watchInquiryLink(watch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonStyles('outline-light', 'md')} mt-2 w-full`}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {`Tirar dúvida no ${contactChannelLabel()}`}
                </a>
              </div>
            )}

            <div className="mt-6">
              <ShippingCalculator subtotal={watch.price * quantity} />
            </div>

            <ul className="mt-6 list-none divide-y divide-paper-line border-y border-paper-line">
              {watch.hasBoxAndPapers && (
                <li className="flex items-center gap-3 py-3">
                  <BoxIcon className="h-5 w-5 shrink-0 text-gold-600" />
                  <span className="text-sm text-ink-500">
                    Acompanha caixa e documentos originais
                  </span>
                </li>
              )}
              <li className="flex items-center gap-3 py-3">
                <ShieldIcon className="h-5 w-5 shrink-0 text-gold-600" />
                <span className="text-sm text-ink-500">
                  {`Garantia de ${watch.warrantyMonths} meses`}
                </span>
              </li>
              <li className="flex items-center gap-3 py-3">
                <CheckIcon className="h-5 w-5 shrink-0 text-gold-600" />
                <span className="text-sm text-ink-500">
                  Procedência verificada antes da entrega
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="descricao">
            <h2 id="descricao" className="text-xl text-ink-950">
              Descrição
            </h2>
            <p className="mt-3 leading-relaxed text-ink-500">{watch.description}</p>
          </section>

          <section aria-labelledby="especificacoes">
            <h2 id="especificacoes" className="text-xl text-ink-950">
              Especificações
            </h2>
            <dl className="mt-3 list-none">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-4 border-b border-paper-line py-2.5"
                >
                  <dt className="text-sm text-ink-500">{spec.label}</dt>
                  <dd className="text-right text-sm text-ink-950">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <section className="bg-ink-950 text-cream" aria-label="Garantias da loja">
        <div className="container-brand grid gap-8 py-12 sm:grid-cols-3">
          {[
            {
              icon: ShieldIcon,
              title: 'Original, sempre',
              text: 'Sem réplica. Se não for original, não entra no catálogo.',
            },
            {
              icon: BoxIcon,
              title: 'Caixa e documentos',
              text: 'A peça chega completa, com a procedência comprovada.',
            },
            {
              icon: WhatsAppIcon,
              title: 'Atendimento direto',
              text: 'Você fala com quem vende, antes e depois da compra.',
            },
          ].map((item) => (
            <div key={item.title}>
              <item.icon className="h-6 w-6 text-gold-500" />
              <h2 className="mt-3 text-base text-cream">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-brand py-14" aria-labelledby="relacionados">
        <h2 id="relacionados" className="text-xl text-ink-950 sm:text-2xl">
          Quem viu este, viu também
        </h2>

        <div className="mt-6">
          {related.status === 'loading' && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}

          {related.status === 'success' && related.data.length > 0 && (
            <ul className="grid list-none grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
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

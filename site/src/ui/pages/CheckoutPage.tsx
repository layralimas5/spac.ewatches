import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/application/use-cart'
import { isCartEmpty } from '@/domain/cart'
import { computeTotals, type Customer, type PaymentMethod, type ShippingAddress } from '@/domain/order'
import {
  formatPostalCode,
  isValidPostalCode,
  normalizePostalCode,
  type ShippingOption,
} from '@/domain/shipping'
import { paymentGateway, shippingProvider } from '@/infra'
import { PIX_DISCOUNT_PERCENT } from '@/config/commerce'
import { formatPrice } from '@/lib/format'
import { Seo } from '@/ui/components/Seo'
import { buttonStyles } from '@/ui/components/Button'
import { QuantityStepper } from '@/ui/components/QuantityStepper'
import { StateMessage } from '@/ui/components/StateMessage'
import { WatchPhoto } from '@/ui/components/WatchPhoto'
import { cn } from '@/lib/cn'

type Errors = Partial<Record<string, string>>

const emptyCustomer: Customer = { name: '', email: '', phone: '', document: '' }
const emptyAddress: ShippingAddress = {
  postalCode: '',
  street: '',
  number: '',
  district: '',
  city: '',
  state: '',
}

/**
 * Checkout em página única, com o resumo do pedido sempre visível.
 *
 * Validação acontece no envio e as mensagens ficam presas ao campo por
 * `aria-describedby` — erro que só aparece como texto solto no topo não é lido
 * por quem usa leitor de tela ao chegar no campo errado.
 */
export default function CheckoutPage() {
  const { cart, subtotal, setQuantity, remove, clear } = useCart()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<Customer>(emptyCustomer)
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [shippingOptions, setShippingOptions] = useState<readonly ShippingOption[]>([])
  const [shipping, setShipping] = useState<ShippingOption | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const totals = computeTotals(cart, shipping, paymentMethod, PIX_DISCOUNT_PERCENT)

  if (isCartEmpty(cart)) {
    return (
      <div className="container-brand py-20">
        <Seo
          title="Carrinho vazio"
          description="Seu carrinho da Space Watches está vazio."
          path="/checkout"
        />
        <StateMessage
          title="Seu carrinho está vazio"
          description="Escolha uma peça no catálogo para continuar."
          action={
            <Link to="/catalogo" className={buttonStyles('primary', 'md')}>
              Ver catálogo
            </Link>
          }
        />
      </div>
    )
  }

  const loadShipping = async () => {
    if (!isValidPostalCode(address.postalCode)) {
      setErrors((current) => ({ ...current, postalCode: 'Digite os 8 dígitos do CEP.' }))
      return
    }

    try {
      const quote = await shippingProvider.quote({
        postalCode: normalizePostalCode(address.postalCode),
        subtotal,
      })
      setShippingOptions(quote.options)
      setShipping(quote.options[0] ?? null)
      setErrors((current) => ({ ...current, postalCode: undefined }))
    } catch {
      setErrors((current) => ({ ...current, postalCode: 'Não consegui calcular o frete.' }))
    }
  }

  const validate = (): boolean => {
    const next: Errors = {}

    if (customer.name.trim().length < 3) next['name'] = 'Informe seu nome completo.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email)) next['email'] = 'E-mail inválido.'
    if (customer.phone.replace(/\D/g, '').length < 10) next['phone'] = 'Telefone com DDD.'
    if (customer.document.replace(/\D/g, '').length !== 11) next['document'] = 'CPF com 11 dígitos.'

    if (!isValidPostalCode(address.postalCode)) next['postalCode'] = 'CEP inválido.'
    if (address.street.trim() === '') next['street'] = 'Informe a rua.'
    if (address.number.trim() === '') next['number'] = 'Informe o número.'
    if (address.district.trim() === '') next['district'] = 'Informe o bairro.'
    if (address.city.trim() === '') next['city'] = 'Informe a cidade.'
    if (address.state.trim().length !== 2) next['state'] = 'UF com 2 letras.'

    if (shipping === null) next['shipping'] = 'Calcule o frete e escolha uma opção.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    if (!validate() || shipping === null) return

    setSubmitting(true)

    try {
      const result = await paymentGateway.checkout(
        { items: cart.items, customer, address, shipping, paymentMethod },
        totals,
      )

      if (result.status === 'unavailable') {
        setSubmitError(result.reason)
        return
      }

      // O carrinho só é esvaziado depois que o pedido foi aceito — falhar no
      // meio e perder tudo é a pior coisa que um checkout pode fazer.
      clear()

      if (result.status === 'pending' && result.redirectUrl !== undefined) {
        window.open(result.redirectUrl, '_blank', 'noopener,noreferrer')
      }

      navigate(`/pedido/${result.orderCode}`)
    } catch {
      setSubmitError('Não consegui registrar seu pedido agora. Tente de novo em instantes.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Seo
        title="Finalizar compra"
        description="Finalize seu pedido na Space Watches."
        path="/checkout"
      />

      <div className="container-brand py-10">
        <h1 className="text-2xl text-ink-950 sm:text-3xl">Finalizar compra</h1>

        <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]" noValidate>
          <div className="space-y-8">
            <fieldset className="rounded-lg border border-paper-line p-5">
              <legend className="px-2 text-sm font-semibold text-ink-950">Seus dados</legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="nome"
                  label="Nome completo"
                  value={customer.name}
                  onChange={(value) => setCustomer({ ...customer, name: value })}
                  error={errors['name']}
                  autoComplete="name"
                  className="sm:col-span-2"
                />
                <Field
                  id="email"
                  label="E-mail"
                  type="email"
                  value={customer.email}
                  onChange={(value) => setCustomer({ ...customer, email: value })}
                  error={errors['email']}
                  autoComplete="email"
                />
                <Field
                  id="telefone"
                  label="Telefone com DDD"
                  value={customer.phone}
                  onChange={(value) => setCustomer({ ...customer, phone: value })}
                  error={errors['phone']}
                  autoComplete="tel"
                />
                <Field
                  id="cpf"
                  label="CPF"
                  value={customer.document}
                  onChange={(value) => setCustomer({ ...customer, document: value })}
                  error={errors['document']}
                  autoComplete="off"
                />
              </div>
            </fieldset>

            <fieldset className="rounded-lg border border-paper-line p-5">
              <legend className="px-2 text-sm font-semibold text-ink-950">Entrega</legend>

              <div className="grid gap-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="cep" className="block text-xs font-medium text-ink-500">
                    CEP
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="cep"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={formatPostalCode(address.postalCode)}
                      onChange={(event) =>
                        setAddress({
                          ...address,
                          postalCode: normalizePostalCode(event.target.value),
                        })
                      }
                      aria-invalid={errors['postalCode'] !== undefined}
                      aria-describedby={errors['postalCode'] !== undefined ? 'cep-erro' : undefined}
                      className={fieldClass(errors['postalCode'] !== undefined)}
                    />
                    <button
                      type="button"
                      onClick={loadShipping}
                      className="h-11 shrink-0 rounded-md border border-ink-950 px-4 text-sm font-medium text-ink-950 hover:bg-ink-950 hover:text-cream"
                    >
                      Calcular
                    </button>
                  </div>
                  {errors['postalCode'] !== undefined && (
                    <p id="cep-erro" className="mt-1 text-xs text-ink-950">
                      {errors['postalCode']}
                    </p>
                  )}
                </div>

                <Field
                  id="rua"
                  label="Rua"
                  value={address.street}
                  onChange={(value) => setAddress({ ...address, street: value })}
                  error={errors['street']}
                  autoComplete="address-line1"
                  className="sm:col-span-4"
                />
                <Field
                  id="numero"
                  label="Número"
                  value={address.number}
                  onChange={(value) => setAddress({ ...address, number: value })}
                  error={errors['number']}
                  className="sm:col-span-2"
                />
                <Field
                  id="complemento"
                  label="Complemento (opcional)"
                  value={address.complement ?? ''}
                  onChange={(value) => setAddress({ ...address, complement: value })}
                  className="sm:col-span-3"
                />
                <Field
                  id="bairro"
                  label="Bairro"
                  value={address.district}
                  onChange={(value) => setAddress({ ...address, district: value })}
                  error={errors['district']}
                  className="sm:col-span-3"
                />
                <Field
                  id="cidade"
                  label="Cidade"
                  value={address.city}
                  onChange={(value) => setAddress({ ...address, city: value })}
                  error={errors['city']}
                  className="sm:col-span-4"
                />
                <Field
                  id="uf"
                  label="UF"
                  value={address.state}
                  onChange={(value) => setAddress({ ...address, state: value.toUpperCase() })}
                  error={errors['state']}
                  className="sm:col-span-2"
                />
              </div>

              {shippingOptions.length > 0 && (
                <div className="mt-5 space-y-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-4 rounded-md border p-3 transition-colors',
                        shipping?.id === option.id
                          ? 'border-gold-600 bg-gold-500/5'
                          : 'border-paper-line hover:border-ink-500/40',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="frete"
                          checked={shipping?.id === option.id}
                          onChange={() => setShipping(option)}
                          className="accent-gold-600"
                        />
                        <span>
                          <span className="block text-sm text-ink-950">{option.label}</span>
                          <span className="block text-xs text-ink-500">
                            {`Até ${option.estimatedDays} dias úteis`}
                          </span>
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-ink-950">
                        {option.price === 0 ? 'Grátis' : formatPrice(option.price)}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {errors['shipping'] !== undefined && (
                <p className="mt-3 text-xs text-ink-950">{errors['shipping']}</p>
              )}
            </fieldset>

            <fieldset className="rounded-lg border border-paper-line p-5">
              <legend className="px-2 text-sm font-semibold text-ink-950">Pagamento</legend>

              <div className="space-y-2">
                {(
                  [
                    {
                      id: 'pix' as const,
                      label: 'Pix',
                      hint:
                        PIX_DISCOUNT_PERCENT > 0
                          ? `${PIX_DISCOUNT_PERCENT}% de desconto`
                          : 'Aprovação imediata',
                    },
                    { id: 'cartao' as const, label: 'Cartão de crédito', hint: 'Até 12x sem juros' },
                  ] satisfies ReadonlyArray<{ id: PaymentMethod; label: string; hint: string }>
                ).map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors',
                      paymentMethod === method.id
                        ? 'border-gold-600 bg-gold-500/5'
                        : 'border-paper-line hover:border-ink-500/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="pagamento"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-gold-600"
                    />
                    <span>
                      <span className="block text-sm text-ink-950">{method.label}</span>
                      <span className="block text-xs text-ink-500">{method.hint}</span>
                    </span>
                  </label>
                ))}
              </div>

              <p className="mt-4 rounded-md bg-paper-alt px-3 py-2.5 text-xs leading-relaxed text-ink-500">
                O pagamento é combinado no atendimento. Ao finalizar, seu pedido é registrado e
                aberto no WhatsApp da loja com todos os dados — sem precisar digitar nada de novo.
              </p>
            </fieldset>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-paper-line p-5">
              <h2 className="text-sm font-semibold text-ink-950">Resumo do pedido</h2>

              <ul className="mt-4 list-none divide-y divide-paper-line">
                {cart.items.map((item) => (
                  <li key={item.watchId} className="flex gap-3 py-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded border border-paper-line bg-paper-alt">
                      <WatchPhoto
                        image={
                          item.imageUrl !== undefined
                            ? { url: item.imageUrl, alt: item.name }
                            : undefined
                        }
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink-950">{item.name}</p>
                      <p className="text-xs text-ink-500">{item.brand}</p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <QuantityStepper
                          value={item.quantity}
                          max={item.maxQuantity}
                          onChange={(quantity) => setQuantity(item.watchId, quantity)}
                          label={item.name}
                        />
                        <button
                          type="button"
                          onClick={() => remove(item.watchId)}
                          className="text-xs text-ink-500 hover:text-ink-950"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 border-t border-paper-line pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Subtotal</dt>
                  <dd className="text-ink-950">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Frete</dt>
                  <dd className="text-ink-950">
                    {shipping === null
                      ? 'Calcule o CEP'
                      : totals.shipping === 0
                        ? 'Grátis'
                        : formatPrice(totals.shipping)}
                  </dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Desconto no Pix</dt>
                    <dd className="text-gold-700">{`-${formatPrice(totals.discount)}`}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-paper-line pt-3 text-base font-semibold">
                  <dt className="text-ink-950">Total</dt>
                  <dd className="text-ink-950">{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              {submitError !== null && (
                <p role="alert" className="mt-4 rounded-md bg-paper-alt px-3 py-2 text-xs text-ink-950">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${buttonStyles('primary', 'lg')} mt-5 w-full`}
              >
                {isSubmitting ? 'Registrando pedido…' : 'Finalizar pedido'}
              </button>

              <Link
                to="/catalogo"
                className="mt-3 block text-center text-xs text-ink-500 hover:text-ink-950"
              >
                Continuar comprando
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </>
  )
}

function fieldClass(hasError: boolean): string {
  return cn(
    'h-11 w-full rounded-md border bg-paper px-3 text-sm text-ink-950 focus:border-gold-600',
    hasError ? 'border-ink-950' : 'border-paper-line',
  )
}

interface FieldProps {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly error?: string | undefined
  readonly type?: string
  readonly autoComplete?: string
  readonly className?: string
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  className,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-ink-500">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? `${id}-erro` : undefined}
        className={cn(fieldClass(error !== undefined), 'mt-1.5')}
      />
      {error !== undefined && (
        <p id={`${id}-erro`} className="mt-1 text-xs text-ink-950">
          {error}
        </p>
      )}
    </div>
  )
}

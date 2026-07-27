import { useMemo, useState } from 'react'
import { useCustomers, useOrders } from '@/application/use-store'
import { customerStore, newId } from '@/infra'
import { customerInitials, type Customer } from '@/domain/customer'
import { isRevenue, orderTotal } from '@/domain/order'
import { sumCents } from '@/domain/money'
import { formatMoney, formatPhone, formatRelative, whatsappLink } from '@/lib/format'
import { Card, EmptyState, PageHeader } from '@/ui/components/ui'
import { Button, IconButton } from '@/ui/components/Button'
import { Modal } from '@/ui/components/Modal'
import { FormGrid, TextAreaField, TextField } from '@/ui/components/form'
import { PencilIcon, PlusIcon, SearchIcon, TrashIcon, WhatsAppIcon } from '@/ui/components/icons'

interface FormState {
  readonly id: string | null
  name: string
  phone: string
  email: string
  document: string
  city: string
  state: string
  notes: string
}

function emptyForm(): FormState {
  return { id: null, name: '', phone: '', email: '', document: '', city: '', state: '', notes: '' }
}

function toForm(customer: Customer): FormState {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email ?? '',
    document: customer.document ?? '',
    city: customer.city ?? '',
    state: customer.state ?? '',
    notes: customer.notes ?? '',
  }
}

function optionalField(name: string, value: string): Record<string, string> {
  const trimmed = value.trim()
  return trimmed === '' ? {} : { [name]: trimmed }
}

export default function ClientesPage() {
  const customers = useCustomers()
  const orders = useOrders()
  const [query, setQuery] = useState('')
  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return customers
      .filter(
        (customer) =>
          term === '' ||
          `${customer.name} ${customer.phone} ${customer.city ?? ''}`.toLowerCase().includes(term),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [customers, query])

  /** Quanto o cliente já comprou de verdade. Orçamento não conta. */
  const totalSpent = (customerId: string) =>
    sumCents(
      orders.filter((order) => order.customerId === customerId && isRevenue(order)).map(orderTotal),
    )

  const orderCount = (customerId: string) =>
    orders.filter((order) => order.customerId === customerId).length

  const save = () => {
    if (form === null) return

    const nextErrors: Record<string, string> = {}
    if (form.name.trim() === '') nextErrors['name'] = 'Informe o nome.'
    if (form.phone.replace(/\D/g, '').length < 10) {
      nextErrors['phone'] = 'Informe o telefone com DDD.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    customerStore.upsert({
      id: form.id ?? newId(),
      name: form.name.trim(),
      // Guarda só dígitos: a máscara é assunto da tela, não do dado.
      phone: form.phone.replace(/\D/g, ''),
      ...optionalField('email', form.email),
      ...optionalField('document', form.document),
      ...optionalField('city', form.city),
      ...optionalField('state', form.state.toUpperCase()),
      ...optionalField('notes', form.notes),
      createdAt:
        customers.find((customer) => customer.id === form.id)?.createdAt ??
        new Date().toISOString(),
    })

    setForm(null)
  }

  const removeCustomer = (customer: Customer) => {
    const pending = orderCount(customer.id)
    const message =
      pending > 0
        ? `${customer.name} tem ${pending} pedido(s) no histórico. Excluir mesmo assim?`
        : `Excluir ${customer.name} da base?`
    if (window.confirm(message)) customerStore.remove(customer.id)
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        description="A ficha de quem já comprou e de quem está conversando. O que a conversa ensinou fica anotado aqui."
        action={
          <Button onClick={() => { setErrors({}); setForm(emptyForm()) }}>
            <PlusIcon className="h-4 w-4" />
            Novo cliente
          </Button>
        }
      />

      <div className="relative sm:max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <label htmlFor="busca-clientes" className="sr-only">
          Buscar cliente
        </label>
        <input
          id="busca-clientes"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nome, telefone ou cidade"
          className="h-11 w-full rounded-lg border border-paper-line bg-paper pr-3 pl-9 text-sm focus:border-ink-950"
        />
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhum cliente encontrado"
            description="Cadastre o primeiro cliente ou ajuste a busca."
          />
        </Card>
      ) : (
        <ul className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((customer) => (
            <li key={customer.id}>
              <Card className="flex h-full flex-col p-5">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-alt text-sm font-semibold text-ink-700"
                  >
                    {customerInitials(customer)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink-950">{customer.name}</p>
                    <p className="tabular text-sm text-ink-500">{formatPhone(customer.phone)}</p>
                    {(customer.city !== undefined || customer.state !== undefined) && (
                      <p className="text-xs text-ink-400">
                        {[customer.city, customer.state].filter(Boolean).join('/')}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <IconButton
                      label={`Editar ${customer.name}`}
                      onClick={() => { setErrors({}); setForm(toForm(customer)) }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label={`Excluir ${customer.name}`}
                      tone="danger"
                      onClick={() => removeCustomer(customer)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>

                {customer.notes !== undefined && (
                  <p className="mt-4 rounded-lg bg-paper-alt px-3 py-2 text-xs leading-relaxed text-ink-700">
                    {customer.notes}
                  </p>
                )}

                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-paper-line pt-4 text-sm">
                  <div>
                    <dt className="text-xs text-ink-400">Já comprou</dt>
                    <dd className="tabular font-medium text-ink-950">
                      {formatMoney(totalSpent(customer.id))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">Pedidos</dt>
                    <dd className="tabular font-medium text-ink-950">{orderCount(customer.id)}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-ink-400">
                    Cliente desde {formatRelative(customer.createdAt)}
                  </span>
                  <a
                    href={whatsappLink(customer.phone, `Olá, ${customer.name.split(' ')[0]}!`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-950 underline underline-offset-4"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Conversar
                  </a>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {form !== null && (
        <Modal
          title={form.id === null ? 'Novo cliente' : 'Editar cliente'}
          description="Só nome e telefone são obrigatórios. O resto entra conforme a conversa acontece."
          onClose={() => setForm(null)}
          footer={
            <>
              <Button variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar cliente</Button>
            </>
          }
        >
          <div className="space-y-4">
            <FormGrid>
              <TextField
                id="name"
                label="Nome"
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
                {...(errors['name'] !== undefined && { error: errors['name'] })}
              />
              <TextField
                id="phone"
                label="Telefone com DDD"
                value={formatPhone(form.phone)}
                inputMode="tel"
                placeholder="(11) 98765-4321"
                onChange={(value) => setForm({ ...form, phone: value })}
                {...(errors['phone'] !== undefined && { error: errors['phone'] })}
              />
              <TextField
                id="email"
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
              />
              <TextField
                id="document"
                label="CPF"
                value={form.document}
                onChange={(value) => setForm({ ...form, document: value })}
              />
              <TextField
                id="city"
                label="Cidade"
                value={form.city}
                onChange={(value) => setForm({ ...form, city: value })}
              />
              <TextField
                id="state"
                label="UF"
                value={form.state}
                onChange={(value) => setForm({ ...form, state: value })}
              />
            </FormGrid>

            <TextAreaField
              id="notes"
              label="Observações"
              value={form.notes}
              onChange={(value) => setForm({ ...form, notes: value })}
              placeholder="Modelo que procura, faixa de preço, melhor horário para falar"
            />
          </div>
        </Modal>
      )}
    </>
  )
}

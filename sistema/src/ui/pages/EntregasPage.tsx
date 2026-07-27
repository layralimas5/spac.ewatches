import { useState } from 'react'
import { useCustomers, useDeliveries, useOrders } from '@/application/use-store'
import { deliveryStore, newId, orderStore } from '@/infra'
import {
  deliveryStatusLabel,
  isLate,
  nextDeliveryStatus,
  type Delivery,
  type DeliveryStatus,
} from '@/domain/delivery'
import { formatDate, formatRelative, whatsappLink } from '@/lib/format'
import { Badge, Card, EmptyState, PageHeader, StatCard } from '@/ui/components/ui'
import { Button, IconButton } from '@/ui/components/Button'
import { Modal } from '@/ui/components/Modal'
import { FormGrid, SelectField, TextAreaField, TextField } from '@/ui/components/form'
import { AlertIcon, ArrowRightIcon, PencilIcon, PlusIcon, TruckIcon, WhatsAppIcon } from '@/ui/components/icons'
import { deliveryTone } from '@/ui/lib/tones'

interface FormState {
  readonly id: string | null
  orderId: string
  carrier: string
  trackingCode: string
  status: DeliveryStatus
  estimatedFor: string
  notes: string
}

function toForm(delivery: Delivery): FormState {
  return {
    id: delivery.id,
    orderId: delivery.orderId,
    carrier: delivery.carrier,
    trackingCode: delivery.trackingCode ?? '',
    status: delivery.status,
    estimatedFor: delivery.estimatedFor ?? '',
    notes: delivery.notes ?? '',
  }
}

export default function EntregasPage() {
  const deliveries = useDeliveries()
  const orders = useOrders()
  const customers = useCustomers()
  const [form, setForm] = useState<FormState | null>(null)

  const orderOf = (delivery: Delivery) => orders.find((order) => order.id === delivery.orderId)

  const customerOf = (delivery: Delivery) => {
    const order = orderOf(delivery)
    return order === undefined
      ? undefined
      : customers.find((customer) => customer.id === order.customerId)
  }

  const open = deliveries.filter((delivery) => delivery.status !== 'entregue')
  const late = deliveries.filter((delivery) => isLate(delivery))

  const sorted = [...deliveries].sort((a, b) => {
    // Entregue vai para o fim: o que importa é o que ainda está na rua.
    if ((a.status === 'entregue') !== (b.status === 'entregue')) {
      return a.status === 'entregue' ? 1 : -1
    }
    return b.updatedAt.localeCompare(a.updatedAt)
  })

  /**
   * Avança a entrega e mantém o pedido em sincronia: postar significa enviado,
   * e receber significa entregue. Sem isso, as duas telas contam histórias
   * diferentes sobre o mesmo pedido.
   */
  const advance = (delivery: Delivery) => {
    const next = nextDeliveryStatus(delivery.status)
    if (next === null) return

    deliveryStore.upsert({ ...delivery, status: next, updatedAt: new Date().toISOString() })

    const order = orderOf(delivery)
    if (order === undefined || order.status === 'cancelado') return

    if (next === 'postado' && order.status !== 'enviado' && order.status !== 'entregue') {
      orderStore.upsert({ ...order, status: 'enviado' })
    }
    if (next === 'entregue') {
      orderStore.upsert({ ...order, status: 'entregue' })
    }
  }

  const save = () => {
    if (form === null) return

    deliveryStore.upsert({
      id: form.id ?? newId(),
      orderId: form.orderId,
      carrier: form.carrier.trim() === '' ? 'A definir' : form.carrier.trim(),
      ...(form.trackingCode.trim() !== '' && { trackingCode: form.trackingCode.trim().toUpperCase() }),
      status: form.status,
      ...(form.estimatedFor !== '' && { estimatedFor: form.estimatedFor }),
      ...(form.notes.trim() !== '' && { notes: form.notes.trim() }),
      updatedAt: new Date().toISOString(),
    })

    setForm(null)
  }

  const openNew = () => {
    const firstOrder = orders.find((order) => order.status !== 'cancelado')
    if (firstOrder === undefined) {
      window.alert('Registre um pedido antes de criar uma entrega.')
      return
    }
    setForm({
      id: null,
      orderId: firstOrder.id,
      carrier: 'Correios Sedex',
      trackingCode: '',
      status: 'preparando',
      estimatedFor: '',
      notes: '',
    })
  }

  return (
    <>
      <PageHeader
        title="Entregas"
        description="O que está a caminho, com prazo e código de rastreio. Avançar aqui atualiza o pedido junto."
        action={
          <Button onClick={openNew}>
            <PlusIcon className="h-4 w-4" />
            Nova entrega
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Em andamento"
          value={String(open.length)}
          hint="Ainda não chegaram no cliente"
          icon={<TruckIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Atrasadas"
          value={String(late.length)}
          hint={late.length === 0 ? 'Nenhuma passou do prazo' : 'Avise o cliente antes que ele pergunte'}
          tone={late.length === 0 ? 'positive' : 'negative'}
          icon={<AlertIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Entregues"
          value={String(deliveries.length - open.length)}
          hint="Histórico completo"
          tone="positive"
        />
      </div>

      {sorted.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhuma entrega registrada"
            description="Assim que um pedido for postado, registre a entrega para acompanhar o prazo."
          />
        </Card>
      ) : (
        <ul className="grid list-none gap-4 lg:grid-cols-2">
          {sorted.map((delivery) => {
            const order = orderOf(delivery)
            const customer = customerOf(delivery)
            const next = nextDeliveryStatus(delivery.status)
            const overdue = isLate(delivery)

            return (
              <li key={delivery.id}>
                <Card className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="tabular font-medium text-ink-950">
                        {order?.code ?? 'Pedido removido'}
                      </p>
                      <p className="truncate text-sm text-ink-500">
                        {customer?.name ?? 'Cliente removido'}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone={overdue ? 'negative' : deliveryTone(delivery.status)}>
                        {overdue ? 'Atrasada' : deliveryStatusLabel[delivery.status]}
                      </Badge>
                      <IconButton label="Editar entrega" onClick={() => setForm(toForm(delivery))}>
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-ink-400">Transporte</dt>
                      <dd className="text-ink-950">{delivery.carrier}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-400">Previsão</dt>
                      <dd className={overdue ? 'text-negative' : 'text-ink-950'}>
                        {delivery.estimatedFor === undefined
                          ? 'Sem prazo definido'
                          : formatDate(delivery.estimatedFor)}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs text-ink-400">Código de rastreio</dt>
                      <dd className="tabular text-ink-950">
                        {delivery.trackingCode ?? 'Ainda não postado'}
                      </dd>
                    </div>
                  </dl>

                  {delivery.notes !== undefined && (
                    <p className="mt-3 rounded-lg bg-paper-alt px-3 py-2 text-xs leading-relaxed text-ink-700">
                      {delivery.notes}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-paper-line pt-4">
                    <span className="text-xs text-ink-400">
                      Atualizada {formatRelative(delivery.updatedAt)}
                    </span>

                    <div className="flex items-center gap-2">
                      {customer !== undefined && (
                        <a
                          href={whatsappLink(
                            customer.phone,
                            `Olá, ${customer.name.split(' ')[0]}! Novidade do seu pedido ${order?.code ?? ''}: ${deliveryStatusLabel[delivery.status].toLowerCase()}.`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-950 underline underline-offset-4"
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                          Avisar cliente
                        </a>
                      )}

                      {next !== null && (
                        <Button size="sm" variant="outline" onClick={() => advance(delivery)}>
                          {deliveryStatusLabel[next]}
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      {form !== null && (
        <Modal
          title={form.id === null ? 'Nova entrega' : 'Editar entrega'}
          description="O prazo prometido é o que define o alerta de atraso no painel."
          onClose={() => setForm(null)}
          footer={
            <>
              <Button variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar entrega</Button>
            </>
          }
        >
          <div className="space-y-4">
            <FormGrid>
              <SelectField
                id="orderId"
                label="Pedido"
                value={form.orderId}
                onChange={(value) => setForm({ ...form, orderId: value })}
                options={orders.map((order) => ({
                  value: order.id,
                  label: `${order.code} · ${customers.find((c) => c.id === order.customerId)?.name ?? 'Cliente removido'}`,
                }))}
                className="sm:col-span-2"
              />
              <TextField
                id="carrier"
                label="Transportadora"
                value={form.carrier}
                onChange={(value) => setForm({ ...form, carrier: value })}
                placeholder="Correios Sedex, motoboy, retirada em mãos"
              />
              <TextField
                id="trackingCode"
                label="Código de rastreio"
                value={form.trackingCode}
                onChange={(value) => setForm({ ...form, trackingCode: value })}
                placeholder="BR123456789BR"
              />
              <SelectField
                id="status"
                label="Situação"
                value={form.status}
                onChange={(value) => setForm({ ...form, status: value })}
                options={(Object.keys(deliveryStatusLabel) as DeliveryStatus[]).map((status) => ({
                  value: status,
                  label: deliveryStatusLabel[status],
                }))}
              />
              <TextField
                id="estimatedFor"
                label="Previsão de entrega"
                type="date"
                value={form.estimatedFor}
                onChange={(value) => setForm({ ...form, estimatedFor: value })}
              />
            </FormGrid>

            <TextAreaField
              id="notes"
              label="Observações"
              value={form.notes}
              onChange={(value) => setForm({ ...form, notes: value })}
              placeholder="Combinado de entrega, quem recebe, ponto de referência"
            />
          </div>
        </Modal>
      )}
    </>
  )
}

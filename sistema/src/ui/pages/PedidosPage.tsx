import { useMemo, useState } from 'react'
import { useCustomers, useOrders, useProducts } from '@/application/use-store'
import { financeStore, newId, orderStore } from '@/infra'
import {
  generateOrderCode,
  isRevenue,
  nextOrderStatus,
  orderStatusLabel,
  orderTotal,
  paymentMethodLabel,
  type Order,
  type OrderStatus,
  type PaymentMethod,
} from '@/domain/order'
import { productName } from '@/domain/product'
import { sumCents } from '@/domain/money'
import { formatDate, formatMoney, formatMoneyShort, parseMoney } from '@/lib/format'
import { Badge, Card, EmptyState, PageHeader, StatCard, TableWrap, Td, Th } from '@/ui/components/ui'
import { Button, IconButton } from '@/ui/components/Button'
import { Modal } from '@/ui/components/Modal'
import { FormGrid, SelectField, TextAreaField, TextField } from '@/ui/components/form'
import { ArrowRightIcon, CartIcon, PlusIcon, TrashIcon } from '@/ui/components/icons'
import { orderTone } from '@/ui/lib/tones'

interface FormState {
  customerId: string
  productId: string
  quantity: string
  unitPrice: string
  shippingCost: string
  discount: string
  paymentMethod: PaymentMethod
  status: OrderStatus
  notes: string
}

function emptyForm(customerId: string, productId: string, unitPrice: number): FormState {
  return {
    customerId,
    productId,
    quantity: '1',
    unitPrice: (unitPrice / 100).toFixed(2).replace('.', ','),
    shippingCost: '',
    discount: '',
    paymentMethod: 'pix',
    status: 'orcamento',
    notes: '',
  }
}

export default function PedidosPage() {
  const orders = useOrders()
  const customers = useCustomers()
  const products = useProducts()
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos')
  const [form, setForm] = useState<FormState | null>(null)

  const visible = useMemo(
    () =>
      orders
        .filter((order) => statusFilter === 'todos' || order.status === statusFilter)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders, statusFilter],
  )

  const customerName = (id: string) =>
    customers.find((customer) => customer.id === id)?.name ?? 'Cliente removido'

  const revenue = sumCents(orders.filter(isRevenue).map(orderTotal))
  const openOrders = orders.filter(
    (order) => order.status === 'orcamento' || order.status === 'confirmado',
  )

  /**
   * Avança o pedido uma etapa. Quando ele chega em "pago", entra sozinho no
   * financeiro: lançar a mesma venda duas vezes, na mão, é como o caixa
   * desencontra do estoque.
   */
  const advance = (order: Order) => {
    const next = nextOrderStatus(order.status)
    if (next === null) return

    orderStore.upsert({ ...order, status: next })

    if (next === 'pago') {
      financeStore.upsert({
        id: newId(),
        kind: 'entrada',
        category: 'venda',
        description: `Pedido ${order.code} · ${customerName(order.customerId)}`,
        amount: orderTotal(order),
        date: new Date().toISOString().slice(0, 10),
        orderId: order.id,
      })
    }
  }

  const cancel = (order: Order) => {
    if (window.confirm(`Cancelar o pedido ${order.code}?`)) {
      orderStore.upsert({ ...order, status: 'cancelado' })
    }
  }

  const openForm = () => {
    const firstCustomer = customers[0]
    const firstProduct = products[0]
    if (firstCustomer === undefined || firstProduct === undefined) {
      window.alert('Cadastre ao menos um cliente e uma peça antes de criar um pedido.')
      return
    }
    setForm(emptyForm(firstCustomer.id, firstProduct.id, firstProduct.salePrice))
  }

  const save = () => {
    if (form === null) return

    const product = products.find((item) => item.id === form.productId)
    if (product === undefined) return

    const quantity = Math.max(1, Number(form.quantity) || 1)

    orderStore.upsert({
      id: newId(),
      code: generateOrderCode(),
      customerId: form.customerId,
      items: [
        {
          productId: product.id,
          // Congelado: se a peça mudar de nome depois, o pedido antigo não muda.
          description: productName(product),
          quantity,
          unitPrice: parseMoney(form.unitPrice),
        },
      ],
      status: form.status,
      paymentMethod: form.paymentMethod,
      shippingCost: parseMoney(form.shippingCost),
      discount: parseMoney(form.discount),
      createdAt: new Date().toISOString(),
      ...(form.notes.trim() !== '' && { notes: form.notes.trim() }),
    })

    setForm(null)
  }

  const selectedProduct = products.find((item) => item.id === form?.productId)

  return (
    <>
      <PageHeader
        title="Pedidos"
        description="O funil inteiro, do orçamento à entrega. Ao marcar como pago, a venda entra no financeiro sozinha."
        action={
          <Button onClick={openForm}>
            <PlusIcon className="h-4 w-4" />
            Novo pedido
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Vendido (total)"
          value={formatMoneyShort(revenue)}
          hint={`${orders.filter(isRevenue).length} pedidos pagos`}
          icon={<CartIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Em aberto"
          value={String(openOrders.length)}
          hint={`${formatMoneyShort(sumCents(openOrders.map(orderTotal)))} esperando resposta`}
          tone={openOrders.length > 0 ? 'attention' : 'neutral'}
        />
        <StatCard
          label="Ticket médio"
          value={formatMoneyShort(
            orders.filter(isRevenue).length === 0
              ? 0
              : Math.round(revenue / orders.filter(isRevenue).length),
          )}
          hint="Considerando só pedidos pagos"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-paper-line px-5 py-4">
          <label htmlFor="filtro-pedidos" className="sr-only">
            Filtrar por situação
          </label>
          <select
            id="filtro-pedidos"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as OrderStatus | 'todos')}
            className="h-11 rounded-lg border border-paper-line bg-paper px-3 text-sm focus:border-ink-950"
          >
            <option value="todos">Todas as situações</option>
            {(Object.keys(orderStatusLabel) as OrderStatus[]).map((status) => (
              <option key={status} value={status}>
                {orderStatusLabel[status]}
              </option>
            ))}
          </select>

          <p className="ml-auto text-sm text-ink-500" role="status" aria-live="polite">
            {visible.length === 1 ? '1 pedido' : `${visible.length} pedidos`}
          </p>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="Nenhum pedido nessa situação"
            description="Troque o filtro ou registre um pedido novo."
          />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Pedido</Th>
                <Th>Cliente</Th>
                <Th>Itens</Th>
                <Th>Situação</Th>
                <Th className="text-right">Total</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => {
                const next = nextOrderStatus(order.status)
                return (
                  <tr key={order.id}>
                    <Td>
                      <span className="tabular font-medium text-ink-950">{order.code}</span>
                      <span className="block text-xs text-ink-400">
                        {formatDate(order.createdAt)} · {paymentMethodLabel[order.paymentMethod]}
                      </span>
                    </Td>
                    <Td className="text-ink-700">{customerName(order.customerId)}</Td>
                    <Td className="text-ink-700">
                      {order.items.map((item) => (
                        <span key={item.productId} className="block text-xs">
                          {item.quantity}x {item.description}
                        </span>
                      ))}
                    </Td>
                    <Td>
                      <Badge tone={orderTone(order.status)}>{orderStatusLabel[order.status]}</Badge>
                    </Td>
                    <Td className="tabular text-right font-medium text-ink-950">
                      {formatMoney(orderTotal(order))}
                      {order.discount > 0 && (
                        <span className="block text-xs font-normal text-ink-400">
                          desconto de {formatMoney(order.discount)}
                        </span>
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        {next !== null && order.status !== 'cancelado' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => advance(order)}
                            title={`Marcar como ${orderStatusLabel[next].toLowerCase()}`}
                          >
                            {orderStatusLabel[next]}
                            <ArrowRightIcon className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {order.status !== 'cancelado' && order.status !== 'entregue' && (
                          <IconButton
                            label={`Cancelar pedido ${order.code}`}
                            tone="danger"
                            onClick={() => cancel(order)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        )}
                      </div>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </TableWrap>
        )}
      </Card>

      {form !== null && (
        <Modal
          title="Novo pedido"
          description="Uma peça por pedido nesta versão. Pedido com vários itens entra junto com o carrinho do site."
          onClose={() => setForm(null)}
          footer={
            <>
              <Button variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Registrar pedido</Button>
            </>
          }
        >
          <div className="space-y-4">
            <FormGrid>
              <SelectField
                id="customerId"
                label="Cliente"
                value={form.customerId}
                onChange={(value) => setForm({ ...form, customerId: value })}
                options={customers.map((customer) => ({
                  value: customer.id,
                  label: customer.name,
                }))}
                className="sm:col-span-2"
              />
              <SelectField
                id="productId"
                label="Peça"
                value={form.productId}
                onChange={(value) => {
                  const product = products.find((item) => item.id === value)
                  setForm({
                    ...form,
                    productId: value,
                    unitPrice:
                      product === undefined
                        ? form.unitPrice
                        : (product.salePrice / 100).toFixed(2).replace('.', ','),
                  })
                }}
                options={products.map((product) => ({
                  value: product.id,
                  label: `${productName(product)} · ${formatMoney(product.salePrice)}`,
                }))}
                className="sm:col-span-2"
              />
              <TextField
                id="quantity"
                label="Quantidade"
                type="number"
                value={form.quantity}
                onChange={(value) => setForm({ ...form, quantity: value })}
              />
              <TextField
                id="unitPrice"
                label="Preço unitário (R$)"
                value={form.unitPrice}
                inputMode="decimal"
                onChange={(value) => setForm({ ...form, unitPrice: value })}
              />
              <TextField
                id="shippingCost"
                label="Frete (R$)"
                value={form.shippingCost}
                inputMode="decimal"
                placeholder="0,00"
                onChange={(value) => setForm({ ...form, shippingCost: value })}
              />
              <TextField
                id="discount"
                label="Desconto (R$)"
                value={form.discount}
                inputMode="decimal"
                placeholder="0,00"
                onChange={(value) => setForm({ ...form, discount: value })}
              />
              <SelectField
                id="paymentMethod"
                label="Forma de pagamento"
                value={form.paymentMethod}
                onChange={(value) => setForm({ ...form, paymentMethod: value })}
                options={(Object.keys(paymentMethodLabel) as PaymentMethod[]).map((method) => ({
                  value: method,
                  label: paymentMethodLabel[method],
                }))}
              />
              <SelectField
                id="status"
                label="Situação"
                value={form.status}
                onChange={(value) => setForm({ ...form, status: value })}
                options={(Object.keys(orderStatusLabel) as OrderStatus[]).map((status) => ({
                  value: status,
                  label: orderStatusLabel[status],
                }))}
              />
            </FormGrid>

            <TextAreaField
              id="notes"
              label="Observações"
              value={form.notes}
              onChange={(value) => setForm({ ...form, notes: value })}
              placeholder="Combinado de pagamento, prazo prometido, detalhe da entrega"
            />

            {selectedProduct !== undefined && (
              <div className="rounded-lg bg-paper-alt px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Subtotal</span>
                  <span className="tabular font-medium">
                    {formatMoney(
                      parseMoney(form.unitPrice) * Math.max(1, Number(form.quantity) || 1),
                    )}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-paper-line pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span className="tabular">
                    {formatMoney(
                      parseMoney(form.unitPrice) * Math.max(1, Number(form.quantity) || 1) +
                        parseMoney(form.shippingCost) -
                        parseMoney(form.discount),
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

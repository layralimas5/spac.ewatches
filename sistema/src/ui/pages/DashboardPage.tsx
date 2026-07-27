import { Link } from 'react-router-dom'
import { calculateMetrics, growth } from '@/application/metrics'
import {
  useCustomers,
  useDeliveries,
  useFinanceEntries,
  useOrders,
  useProducts,
} from '@/application/use-store'
import { orderStatusLabel, orderTotal, type Order } from '@/domain/order'
import { productName } from '@/domain/product'
import { deliveryStatusLabel } from '@/domain/delivery'
import { formatMoney, formatMoneyShort, formatPercent, formatRelative } from '@/lib/format'
import { Badge, Card, CardHeader, EmptyState, PageHeader, StatCard, Td, TableWrap, Th } from '@/ui/components/ui'
import { AlertIcon, BoxIcon, CartIcon, TruckIcon, WalletIcon } from '@/ui/components/icons'
import { orderTone } from '@/ui/lib/tones'

export default function DashboardPage() {
  const products = useProducts()
  const orders = useOrders()
  const deliveries = useDeliveries()
  const entries = useFinanceEntries()
  const customers = useCustomers()

  const metrics = calculateMetrics(products, orders, deliveries, entries)
  const variation = growth(metrics.monthRevenue, metrics.previousMonthRevenue)

  const customerName = (order: Order): string =>
    customers.find((customer) => customer.id === order.customerId)?.name ?? 'Cliente removido'

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  const openDeliveries = deliveries.filter((delivery) => delivery.status !== 'entregue')

  return (
    <>
      <PageHeader
        title="Painel"
        description="O retrato da operação hoje: o que entrou, o que está parado em estoque e o que precisa de ação."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Faturamento do mês"
          value={formatMoneyShort(metrics.monthRevenue)}
          hint={
            variation === null
              ? 'Sem venda no mês anterior para comparar'
              : `${variation >= 0 ? '+' : ''}${formatPercent(variation)} vs. mês passado`
          }
          tone={variation === null ? 'neutral' : variation >= 0 ? 'positive' : 'negative'}
          icon={<WalletIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Pedidos pagos no mês"
          value={String(metrics.monthOrders)}
          hint={`Ticket médio de ${formatMoneyShort(metrics.averageTicket)}`}
          icon={<CartIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Peças em estoque"
          value={String(metrics.stockCount)}
          hint={`${formatMoneyShort(metrics.stockValue)} parados em custo`}
          icon={<BoxIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Resultado do mês"
          value={formatMoneyShort(metrics.cash.balance)}
          hint={`Entrou ${formatMoneyShort(metrics.cash.income)}, saiu ${formatMoneyShort(metrics.cash.expense)}`}
          tone={metrics.cash.balance >= 0 ? 'positive' : 'negative'}
          icon={<WalletIcon className="h-5 w-5" />}
        />
      </div>

      {(metrics.lowStock.length > 0 || metrics.lateDeliveries.length > 0 || metrics.openOrders > 0) && (
        <Card className="border-attention/30 bg-attention-soft/40 p-5">
          <div className="flex items-start gap-3">
            <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-attention" />
            <div className="space-y-1 text-sm text-ink-950">
              <p className="font-medium">Precisa de atenção</p>
              <ul className="list-none space-y-1 text-ink-700">
                {metrics.openOrders > 0 && (
                  <li>
                    <Link to="/pedidos" className="underline underline-offset-2">
                      {metrics.openOrders === 1
                        ? '1 pedido em aberto esperando resposta'
                        : `${metrics.openOrders} pedidos em aberto esperando resposta`}
                    </Link>
                  </li>
                )}
                {metrics.lowStock.length > 0 && (
                  <li>
                    <Link to="/estoque" className="underline underline-offset-2">
                      {metrics.lowStock.length === 1
                        ? '1 peça no estoque mínimo'
                        : `${metrics.lowStock.length} peças no estoque mínimo`}
                    </Link>
                  </li>
                )}
                {metrics.lateDeliveries.length > 0 && (
                  <li>
                    <Link to="/entregas" className="underline underline-offset-2">
                      {metrics.lateDeliveries.length === 1
                        ? '1 entrega passou do prazo'
                        : `${metrics.lateDeliveries.length} entregas passaram do prazo`}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Últimos pedidos"
            description="Do orçamento à entrega"
            action={
              <Link to="/pedidos" className="text-xs text-ink-500 underline underline-offset-4">
                Ver todos
              </Link>
            }
          />

          {recentOrders.length === 0 ? (
            <EmptyState
              title="Nenhum pedido ainda"
              description="Assim que o primeiro pedido for registrado, ele aparece aqui."
            />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Pedido</Th>
                  <Th>Cliente</Th>
                  <Th>Situação</Th>
                  <Th className="text-right">Valor</Th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <Td>
                      <span className="tabular font-medium text-ink-950">{order.code}</span>
                      <span className="block text-xs text-ink-400">
                        {formatRelative(order.createdAt)}
                      </span>
                    </Td>
                    <Td className="text-ink-700">{customerName(order)}</Td>
                    <Td>
                      <Badge tone={orderTone(order.status)}>{orderStatusLabel[order.status]}</Badge>
                    </Td>
                    <Td className="tabular text-right font-medium text-ink-950">
                      {formatMoney(orderTotal(order))}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Estoque no mínimo" description="Repor antes de anunciar" />
            {metrics.lowStock.length === 0 ? (
              <EmptyState
                title="Nada faltando"
                description="Todas as peças estão acima do estoque mínimo definido."
              />
            ) : (
              <ul className="list-none divide-y divide-paper-line">
                {metrics.lowStock.slice(0, 5).map((product) => (
                  <li key={product.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink-950">{productName(product)}</p>
                      <p className="text-xs text-ink-400">{product.sku}</p>
                    </div>
                    <Badge tone={product.stock === 0 ? 'negative' : 'attention'}>
                      {product.stock === 0 ? 'Zerado' : `${product.stock} un.`}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Entregas em andamento" description="O que está a caminho" />
            {openDeliveries.length === 0 ? (
              <EmptyState
                title="Nenhuma entrega aberta"
                description="Tudo que foi vendido já chegou no cliente."
              />
            ) : (
              <ul className="list-none divide-y divide-paper-line">
                {openDeliveries.slice(0, 5).map((delivery) => {
                  const order = orders.find((item) => item.id === delivery.orderId)
                  return (
                    <li
                      key={delivery.id}
                      className="flex items-center justify-between gap-3 px-5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="tabular truncate text-sm text-ink-950">
                          {order?.code ?? 'Pedido removido'}
                        </p>
                        <p className="truncate text-xs text-ink-400">{delivery.carrier}</p>
                      </div>
                      <Badge tone="info">
                        <TruckIcon className="h-3.5 w-3.5" />
                        {deliveryStatusLabel[delivery.status]}
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}

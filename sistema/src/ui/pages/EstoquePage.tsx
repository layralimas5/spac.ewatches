import { useMemo, useState } from 'react'
import { useProducts } from '@/application/use-store'
import { newId, productStore } from '@/infra'
import {
  marginPercent,
  productConditionLabel,
  productName,
  productStatusLabel,
  stockValue,
  unitMargin,
  type Product,
  type ProductCondition,
  type ProductStatus,
} from '@/domain/product'
import { sumCents } from '@/domain/money'
import { formatMoney, formatMoneyShort, formatPercent, parseMoney } from '@/lib/format'
import { Badge, Card, EmptyState, PageHeader, StatCard, TableWrap, Td, Th } from '@/ui/components/ui'
import { Button, IconButton } from '@/ui/components/Button'
import { Modal } from '@/ui/components/Modal'
import { FormGrid, SelectField, TextAreaField, TextField } from '@/ui/components/form'
import { BoxIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from '@/ui/components/icons'
import { productTone } from '@/ui/lib/tones'

interface FormState {
  readonly id: string | null
  sku: string
  brand: string
  model: string
  reference: string
  condition: ProductCondition
  status: ProductStatus
  costPrice: string
  salePrice: string
  stock: string
  minStock: string
  supplier: string
  notes: string
}

function emptyForm(): FormState {
  return {
    id: null,
    sku: '',
    brand: '',
    model: '',
    reference: '',
    condition: 'novo',
    status: 'disponivel',
    costPrice: '',
    salePrice: '',
    stock: '1',
    minStock: '1',
    supplier: '',
    notes: '',
  }
}

function toForm(product: Product): FormState {
  return {
    id: product.id,
    sku: product.sku,
    brand: product.brand,
    model: product.model,
    reference: product.reference ?? '',
    condition: product.condition,
    status: product.status,
    costPrice: (product.costPrice / 100).toFixed(2).replace('.', ','),
    salePrice: (product.salePrice / 100).toFixed(2).replace('.', ','),
    stock: String(product.stock),
    minStock: String(product.minStock),
    supplier: product.supplier ?? '',
    notes: product.notes ?? '',
  }
}

/** Campos opcionais só entram no registro quando têm conteúdo. */
function optional(value: string): { readonly value?: string } {
  const trimmed = value.trim()
  return trimmed === '' ? {} : { value: trimmed }
}

export default function EstoquePage() {
  const products = useProducts()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'todos'>('todos')
  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return products
      .filter((product) => statusFilter === 'todos' || product.status === statusFilter)
      .filter(
        (product) =>
          term === '' ||
          `${product.brand} ${product.model} ${product.sku} ${product.reference ?? ''}`
            .toLowerCase()
            .includes(term),
      )
      .sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model))
  }, [products, query, statusFilter])

  const inStock = products.filter((product) => product.status !== 'vendido')
  const totalCost = sumCents(inStock.map(stockValue))
  const totalSale = sumCents(inStock.map((product) => product.salePrice * product.stock))

  const save = () => {
    if (form === null) return

    const nextErrors: Record<string, string> = {}
    if (form.brand.trim() === '') nextErrors['brand'] = 'Informe a marca.'
    if (form.model.trim() === '') nextErrors['model'] = 'Informe o modelo.'
    if (form.sku.trim() === '') nextErrors['sku'] = 'Informe o código interno.'
    if (parseMoney(form.salePrice) <= 0) nextErrors['salePrice'] = 'Informe o preço de venda.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const reference = optional(form.reference)
    const supplier = optional(form.supplier)
    const notes = optional(form.notes)

    productStore.upsert({
      id: form.id ?? newId(),
      sku: form.sku.trim().toUpperCase(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      ...(reference.value !== undefined && { reference: reference.value }),
      condition: form.condition,
      status: form.status,
      costPrice: parseMoney(form.costPrice),
      salePrice: parseMoney(form.salePrice),
      stock: Math.max(0, Number(form.stock) || 0),
      minStock: Math.max(0, Number(form.minStock) || 0),
      ...(supplier.value !== undefined && { supplier: supplier.value }),
      ...(notes.value !== undefined && { notes: notes.value }),
      createdAt:
        products.find((product) => product.id === form.id)?.createdAt ?? new Date().toISOString(),
    })

    setForm(null)
  }

  const removeProduct = (product: Product) => {
    const confirmed = window.confirm(
      `Excluir ${productName(product)} do estoque? Essa ação não tem volta.`,
    )
    if (confirmed) productStore.remove(product.id)
  }

  /** Ajuste rápido de quantidade, sem abrir o formulário inteiro. */
  const changeStock = (product: Product, delta: number) => {
    productStore.upsert({ ...product, stock: Math.max(0, product.stock + delta) })
  }

  return (
    <>
      <PageHeader
        title="Estoque"
        description="Cada peça com custo, preço e margem. É daqui que sai o valor parado na prateleira."
        action={
          <Button onClick={() => { setErrors({}); setForm(emptyForm()) }}>
            <PlusIcon className="h-4 w-4" />
            Nova peça
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Peças disponíveis"
          value={String(sumCents(inStock.map((product) => product.stock)))}
          hint={`${inStock.length} modelos cadastrados`}
          icon={<BoxIcon className="h-5 w-5" />}
        />
        <StatCard label="Custo parado" value={formatMoneyShort(totalCost)} hint="O que já foi pago" />
        <StatCard
          label="Margem embutida"
          value={formatMoneyShort(totalSale - totalCost)}
          hint="Se todo o estoque vender pelo preço de tabela"
          tone="positive"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-paper-line px-5 py-4">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <label htmlFor="busca-estoque" className="sr-only">
              Buscar peça
            </label>
            <input
              id="busca-estoque"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Marca, modelo, SKU ou referência"
              className="h-11 w-full rounded-lg border border-paper-line bg-paper pr-3 pl-9 text-sm focus:border-ink-950"
            />
          </div>

          <div>
            <label htmlFor="filtro-status" className="sr-only">
              Filtrar por situação
            </label>
            <select
              id="filtro-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as ProductStatus | 'todos')}
              className="h-11 rounded-lg border border-paper-line bg-paper px-3 text-sm focus:border-ink-950"
            >
              <option value="todos">Todas as situações</option>
              {(Object.keys(productStatusLabel) as ProductStatus[]).map((status) => (
                <option key={status} value={status}>
                  {productStatusLabel[status]}
                </option>
              ))}
            </select>
          </div>

          <p className="ml-auto text-sm text-ink-500" role="status" aria-live="polite">
            {visible.length === 1 ? '1 peça' : `${visible.length} peças`}
          </p>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="Nenhuma peça encontrada"
            description="Ajuste a busca ou o filtro de situação, ou cadastre a primeira peça do estoque."
          />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Peça</Th>
                <Th>Situação</Th>
                <Th className="text-right">Custo</Th>
                <Th className="text-right">Venda</Th>
                <Th className="text-right">Margem</Th>
                <Th className="text-center">Estoque</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <tr key={product.id}>
                  <Td>
                    <p className="font-medium text-ink-950">{productName(product)}</p>
                    <p className="text-xs text-ink-400">
                      {product.sku} · {productConditionLabel[product.condition]}
                    </p>
                  </Td>
                  <Td>
                    <Badge tone={productTone(product.status)}>
                      {productStatusLabel[product.status]}
                    </Badge>
                  </Td>
                  <Td className="tabular text-right text-ink-700">
                    {formatMoney(product.costPrice)}
                  </Td>
                  <Td className="tabular text-right font-medium text-ink-950">
                    {formatMoney(product.salePrice)}
                  </Td>
                  <Td className="tabular text-right">
                    <span className={unitMargin(product) >= 0 ? 'text-positive' : 'text-negative'}>
                      {formatMoney(unitMargin(product))}
                    </span>
                    <span className="block text-xs text-ink-400">
                      {formatPercent(marginPercent(product))}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      <IconButton label={`Tirar uma unidade de ${productName(product)}`} onClick={() => changeStock(product, -1)}>
                        <span aria-hidden="true" className="text-lg leading-none">
                          −
                        </span>
                      </IconButton>
                      <span className="tabular w-8 text-center text-sm font-medium">
                        {product.stock}
                      </span>
                      <IconButton label={`Somar uma unidade de ${productName(product)}`} onClick={() => changeStock(product, 1)}>
                        <span aria-hidden="true" className="text-lg leading-none">
                          +
                        </span>
                      </IconButton>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <IconButton
                        label={`Editar ${productName(product)}`}
                        onClick={() => { setErrors({}); setForm(toForm(product)) }}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        label={`Excluir ${productName(product)}`}
                        tone="danger"
                        onClick={() => removeProduct(product)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      {form !== null && (
        <Modal
          title={form.id === null ? 'Nova peça' : 'Editar peça'}
          description="Custo e preço de venda alimentam a margem do painel."
          onClose={() => setForm(null)}
          footer={
            <>
              <Button variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar peça</Button>
            </>
          }
        >
          <div className="space-y-4">
            <FormGrid>
              <TextField
                id="brand"
                label="Marca"
                value={form.brand}
                onChange={(value) => setForm({ ...form, brand: value })}
                {...(errors['brand'] !== undefined && { error: errors['brand'] })}
              />
              <TextField
                id="model"
                label="Modelo"
                value={form.model}
                onChange={(value) => setForm({ ...form, model: value })}
                {...(errors['model'] !== undefined && { error: errors['model'] })}
              />
              <TextField
                id="sku"
                label="Código interno (SKU)"
                value={form.sku}
                onChange={(value) => setForm({ ...form, sku: value })}
                hint="O mesmo código que aparece no site"
                {...(errors['sku'] !== undefined && { error: errors['sku'] })}
              />
              <TextField
                id="reference"
                label="Referência do fabricante"
                value={form.reference}
                onChange={(value) => setForm({ ...form, reference: value })}
              />
              <SelectField
                id="condition"
                label="Condição"
                value={form.condition}
                onChange={(value) => setForm({ ...form, condition: value })}
                options={[
                  { value: 'novo', label: 'Novo' },
                  { value: 'seminovo', label: 'Seminovo' },
                ]}
              />
              <SelectField
                id="status"
                label="Situação"
                value={form.status}
                onChange={(value) => setForm({ ...form, status: value })}
                options={(Object.keys(productStatusLabel) as ProductStatus[]).map((status) => ({
                  value: status,
                  label: productStatusLabel[status],
                }))}
              />
              <TextField
                id="costPrice"
                label="Custo (R$)"
                value={form.costPrice}
                inputMode="decimal"
                placeholder="0,00"
                onChange={(value) => setForm({ ...form, costPrice: value })}
                hint="Inclua importação e taxas"
              />
              <TextField
                id="salePrice"
                label="Preço de venda (R$)"
                value={form.salePrice}
                inputMode="decimal"
                placeholder="0,00"
                onChange={(value) => setForm({ ...form, salePrice: value })}
                {...(errors['salePrice'] !== undefined && { error: errors['salePrice'] })}
              />
              <TextField
                id="stock"
                label="Quantidade"
                type="number"
                value={form.stock}
                onChange={(value) => setForm({ ...form, stock: value })}
              />
              <TextField
                id="minStock"
                label="Estoque mínimo"
                type="number"
                value={form.minStock}
                onChange={(value) => setForm({ ...form, minStock: value })}
                hint="Abaixo disso o painel avisa"
              />
              <TextField
                id="supplier"
                label="Fornecedor"
                value={form.supplier}
                onChange={(value) => setForm({ ...form, supplier: value })}
                className="sm:col-span-2"
              />
            </FormGrid>

            <TextAreaField
              id="notes"
              label="Observações"
              value={form.notes}
              onChange={(value) => setForm({ ...form, notes: value })}
              placeholder="Estado da peça, o que acompanha, combinado com o fornecedor"
            />
          </div>
        </Modal>
      )}
    </>
  )
}

import { useMemo, useState } from 'react'
import { useProducts } from '@/application/use-store'
import { useSettings } from '@/application/use-settings'
import { downloadCatalogFile, publishedProducts } from '@/application/export-catalog'
import { newId, productStore } from '@/infra'
import {
  availabilityLabel,
  isPublished,
  marginPercent,
  missingForSite,
  productConditionLabel,
  productName,
  productStatusLabel,
  siteInfoOf,
  siteSectionLabel,
  stockValue,
  unitMargin,
  type Availability,
  type Product,
  type ProductCondition,
  type ProductStatus,
  type SiteSection,
} from '@/domain/product'
import { sumCents } from '@/domain/money'
import { formatMoney, formatMoneyShort, formatPercent, parseMoney } from '@/lib/format'
import { Badge, Card, EmptyState, PageHeader, StatCard, TableWrap, Td, Th } from '@/ui/components/ui'
import { Button, IconButton } from '@/ui/components/Button'
import { Modal } from '@/ui/components/Modal'
import { FormGrid, SelectField, TextAreaField, TextField } from '@/ui/components/form'
import {
  BoxIcon,
  DownloadIcon,
  GlobeIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '@/ui/components/icons'
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
  // Publicação no site
  published: boolean
  section: SiteSection
  availability: Availability
  shortDescription: string
  description: string
  imageUrl: string
  imageAlt: string
  movement: string
  caseMaterial: string
  caseSizeMm: string
  glass: string
  waterResistance: string
  bracelet: string
  warrantyMonths: string
  hasBoxAndPapers: boolean
}

function emptyForm(defaultMinStock: number): FormState {
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
    minStock: String(defaultMinStock),
    supplier: '',
    notes: '',
    published: false,
    section: 'catalogo',
    availability: 'pronta-entrega',
    shortDescription: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    movement: '',
    caseMaterial: '',
    caseSizeMm: '',
    glass: 'Safira',
    waterResistance: '',
    bracelet: '',
    warrantyMonths: '12',
    hasBoxAndPapers: true,
  }
}

function toForm(product: Product): FormState {
  const site = siteInfoOf(product)
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
    published: site.published,
    section: site.section,
    availability: site.availability,
    shortDescription: site.shortDescription,
    description: site.description,
    imageUrl: site.imageUrl,
    imageAlt: site.imageAlt,
    movement: site.specs.movement,
    caseMaterial: site.specs.caseMaterial,
    caseSizeMm: site.specs.caseSizeMm === 0 ? '' : String(site.specs.caseSizeMm),
    glass: site.specs.glass,
    waterResistance: site.specs.waterResistance,
    bracelet: site.specs.bracelet,
    warrantyMonths: String(site.warrantyMonths),
    hasBoxAndPapers: site.hasBoxAndPapers,
  }
}

function optional(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

export default function EstoquePage() {
  const products = useProducts()
  const settings = useSettings()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'todos'>('todos')
  const [siteFilter, setSiteFilter] = useState<'todos' | 'publicados' | 'fora'>('todos')
  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return products
      .filter((product) => statusFilter === 'todos' || product.status === statusFilter)
      .filter((product) =>
        siteFilter === 'todos'
          ? true
          : siteFilter === 'publicados'
            ? isPublished(product)
            : !isPublished(product),
      )
      .filter(
        (product) =>
          term === '' ||
          `${product.brand} ${product.model} ${product.sku} ${product.reference ?? ''}`
            .toLowerCase()
            .includes(term),
      )
      .sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model))
  }, [products, query, statusFilter, siteFilter])

  const inStock = products.filter((product) => product.status !== 'vendido')
  const totalCost = sumCents(inStock.map(stockValue))
  const totalSale = sumCents(inStock.map((product) => product.salePrice * product.stock))
  const published = publishedProducts(products)

  const save = () => {
    if (form === null) return

    const nextErrors: Record<string, string> = {}
    if (form.brand.trim() === '') nextErrors['brand'] = 'Informe a marca.'
    if (form.model.trim() === '') nextErrors['model'] = 'Informe o modelo.'
    if (form.sku.trim() === '') nextErrors['sku'] = 'Informe o código interno.'
    if (parseMoney(form.salePrice) <= 0) nextErrors['salePrice'] = 'Informe o preço de venda.'

    // Publicar sem foto ou sem texto não dá erro no site, dá card vazio.
    if (form.published) {
      if (form.imageUrl.trim() === '') nextErrors['imageUrl'] = 'Sem foto a peça não pode ir ao ar.'
      if (form.shortDescription.trim() === '') {
        nextErrors['shortDescription'] = 'É a frase que aparece no card.'
      }
      if (form.description.trim() === '') nextErrors['description'] = 'Descreva a peça.'
    }

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
      ...(reference !== undefined && { reference }),
      condition: form.condition,
      status: form.status,
      costPrice: parseMoney(form.costPrice),
      salePrice: parseMoney(form.salePrice),
      stock: Math.max(0, Number(form.stock) || 0),
      minStock: Math.max(0, Number(form.minStock) || 0),
      ...(supplier !== undefined && { supplier }),
      ...(notes !== undefined && { notes }),
      site: {
        published: form.published,
        section: form.section,
        availability: form.availability,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        // Sem texto alternativo escrito, o nome da peça já é melhor que nada.
        imageAlt:
          form.imageAlt.trim() === ''
            ? `${form.brand.trim()} ${form.model.trim()}`
            : form.imageAlt.trim(),
        specs: {
          movement: form.movement.trim(),
          caseMaterial: form.caseMaterial.trim(),
          caseSizeMm: Math.max(0, Number(form.caseSizeMm) || 0),
          glass: form.glass.trim(),
          waterResistance: form.waterResistance.trim(),
          bracelet: form.bracelet.trim(),
        },
        warrantyMonths: Math.max(0, Number(form.warrantyMonths) || 0),
        hasBoxAndPapers: form.hasBoxAndPapers,
      },
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

  const changeStock = (product: Product, delta: number) => {
    productStore.upsert({ ...product, stock: Math.max(0, product.stock + delta) })
  }

  /** Liga e desliga a vitrine sem abrir o formulário inteiro. */
  const togglePublished = (product: Product) => {
    const site = siteInfoOf(product)

    if (!site.published) {
      const missing = missingForSite(product)
      if (missing.length > 0) {
        window.alert(
          `Falta ${missing.join(', ')} para publicar ${productName(product)}. Abra a peça e complete a aba do site.`,
        )
        return
      }
    }

    productStore.upsert({ ...product, site: { ...site, published: !site.published } })
  }

  return (
    <>
      <PageHeader
        title="Estoque"
        description="Cada peça com custo, preço, margem e o que ela mostra no site."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => downloadCatalogFile(products)}
              disabled={published.length === 0}
            >
              <DownloadIcon className="h-4 w-4" />
              Exportar para o site
            </Button>
            <Button
              onClick={() => {
                setErrors({})
                setForm(emptyForm(settings.defaultMinStock))
              }}
            >
              <PlusIcon className="h-4 w-4" />
              Nova peça
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <StatCard
          label="No site"
          value={String(published.length)}
          hint={`${published.filter((p) => siteInfoOf(p).section === 'destaque').length} em destaque na home`}
          tone={published.length > 0 ? 'info' : 'neutral'}
          icon={<GlobeIcon className="h-5 w-5" />}
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

          <label htmlFor="filtro-site" className="sr-only">
            Filtrar por publicação
          </label>
          <select
            id="filtro-site"
            value={siteFilter}
            onChange={(event) =>
              setSiteFilter(event.target.value as 'todos' | 'publicados' | 'fora')
            }
            className="h-11 rounded-lg border border-paper-line bg-paper px-3 text-sm focus:border-ink-950"
          >
            <option value="todos">Site: tudo</option>
            <option value="publicados">Só publicadas</option>
            <option value="fora">Só fora do site</option>
          </select>

          <p className="ml-auto text-sm text-ink-500" role="status" aria-live="polite">
            {visible.length === 1 ? '1 peça' : `${visible.length} peças`}
          </p>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title="Nenhuma peça encontrada"
            description="Ajuste a busca ou os filtros, ou cadastre a primeira peça do estoque."
          />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Peça</Th>
                <Th>Situação</Th>
                <Th>No site</Th>
                <Th className="text-right">Custo</Th>
                <Th className="text-right">Venda</Th>
                <Th className="text-right">Margem</Th>
                <Th className="text-center">Estoque</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => {
                const site = siteInfoOf(product)
                const missing = missingForSite(product)

                return (
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
                    <Td>
                      <button
                        type="button"
                        onClick={() => togglePublished(product)}
                        className="text-left"
                        title={
                          site.published
                            ? 'Clique para tirar do site'
                            : 'Clique para publicar no site'
                        }
                      >
                        {site.published ? (
                          <Badge tone={missing.length > 0 ? 'attention' : 'positive'}>
                            <GlobeIcon className="h-3.5 w-3.5" />
                            {missing.length > 0 ? 'Publicada, incompleta' : siteSectionLabel[site.section].replace(' (home)', '')}
                          </Badge>
                        ) : (
                          <Badge>Fora do site</Badge>
                        )}
                      </button>
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
                        <IconButton
                          label={`Tirar uma unidade de ${productName(product)}`}
                          onClick={() => changeStock(product, -1)}
                        >
                          <span aria-hidden="true" className="text-lg leading-none">
                            −
                          </span>
                        </IconButton>
                        <span className="tabular w-8 text-center text-sm font-medium">
                          {product.stock}
                        </span>
                        <IconButton
                          label={`Somar uma unidade de ${productName(product)}`}
                          onClick={() => changeStock(product, 1)}
                        >
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
                          onClick={() => {
                            setErrors({})
                            setForm(toForm(product))
                          }}
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
                )
              })}
            </tbody>
          </TableWrap>
        )}
      </Card>

      {form !== null && (
        <Modal
          title={form.id === null ? 'Nova peça' : 'Editar peça'}
          description="A primeira parte é interna. A segunda é o que o cliente vê no site."
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
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xs font-medium tracking-wide text-ink-400 uppercase">
                Dados internos
              </h3>

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
                label="Observações internas"
                value={form.notes}
                onChange={(value) => setForm({ ...form, notes: value })}
                placeholder="Estado da peça, o que acompanha, combinado com o fornecedor"
              />
            </section>

            <section className="space-y-4 border-t border-paper-line pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xs font-medium tracking-wide text-ink-400 uppercase">
                    Publicação no site
                  </h3>
                  <p className="mt-1 text-xs text-ink-500">
                    O que o cliente vê. Nada daqui revela custo nem fornecedor.
                  </p>
                </div>

                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-medium text-ink-950">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) => setForm({ ...form, published: event.target.checked })}
                    className="h-4 w-4 accent-ink-950"
                  />
                  Publicar
                </label>
              </div>

              <FormGrid>
                <SelectField
                  id="section"
                  label="Onde aparece"
                  value={form.section}
                  onChange={(value) => setForm({ ...form, section: value })}
                  options={(Object.keys(siteSectionLabel) as SiteSection[]).map((section) => ({
                    value: section,
                    label: siteSectionLabel[section],
                  }))}
                />
                <SelectField
                  id="availability"
                  label="Disponibilidade"
                  value={form.availability}
                  onChange={(value) => setForm({ ...form, availability: value })}
                  options={(Object.keys(availabilityLabel) as Availability[]).map(
                    (availability) => ({
                      value: availability,
                      label: availabilityLabel[availability],
                    }),
                  )}
                />
                <TextField
                  id="imageUrl"
                  label="Foto"
                  value={form.imageUrl}
                  onChange={(value) => setForm({ ...form, imageUrl: value })}
                  placeholder="/catalogo/rolex-datejust-41.webp"
                  hint="Arquivo em site/public/catalogo/"
                  className="sm:col-span-2"
                  {...(errors['imageUrl'] !== undefined && { error: errors['imageUrl'] })}
                />
                <TextField
                  id="imageAlt"
                  label="Descrição da foto"
                  value={form.imageAlt}
                  onChange={(value) => setForm({ ...form, imageAlt: value })}
                  placeholder="Rolex Datejust 41 com mostrador azul"
                  hint="Lido por quem usa leitor de tela, e pelo Google"
                  className="sm:col-span-2"
                />
              </FormGrid>

              <TextField
                id="shortDescription"
                label="Frase do card"
                value={form.shortDescription}
                onChange={(value) => setForm({ ...form, shortDescription: value })}
                placeholder="O clássico que nunca sai de linha, em aço com bezel canelado."
                {...(errors['shortDescription'] !== undefined && {
                  error: errors['shortDescription'],
                })}
              />

              <TextAreaField
                id="description"
                label="Descrição completa"
                rows={4}
                value={form.description}
                onChange={(value) => setForm({ ...form, description: value })}
                placeholder="O texto da página da peça: o que ela é, por que vale, o que acompanha."
                {...(errors['description'] !== undefined && { error: errors['description'] })}
              />

              <h4 className="pt-2 text-xs font-medium tracking-wide text-ink-400 uppercase">
                Ficha técnica
              </h4>

              <FormGrid>
                <TextField
                  id="movement"
                  label="Movimento"
                  value={form.movement}
                  onChange={(value) => setForm({ ...form, movement: value })}
                  placeholder="Automático, calibre 3235"
                />
                <TextField
                  id="caseMaterial"
                  label="Material da caixa"
                  value={form.caseMaterial}
                  onChange={(value) => setForm({ ...form, caseMaterial: value })}
                  placeholder="Aço inoxidável"
                />
                <TextField
                  id="caseSizeMm"
                  label="Diâmetro (mm)"
                  type="number"
                  value={form.caseSizeMm}
                  onChange={(value) => setForm({ ...form, caseSizeMm: value })}
                />
                <TextField
                  id="glass"
                  label="Vidro"
                  value={form.glass}
                  onChange={(value) => setForm({ ...form, glass: value })}
                />
                <TextField
                  id="waterResistance"
                  label="Resistência à água"
                  value={form.waterResistance}
                  onChange={(value) => setForm({ ...form, waterResistance: value })}
                  placeholder="100 metros"
                />
                <TextField
                  id="bracelet"
                  label="Pulseira"
                  value={form.bracelet}
                  onChange={(value) => setForm({ ...form, bracelet: value })}
                  placeholder="Aço inoxidável"
                />
                <TextField
                  id="warrantyMonths"
                  label="Garantia (meses)"
                  type="number"
                  value={form.warrantyMonths}
                  onChange={(value) => setForm({ ...form, warrantyMonths: value })}
                />
                <label className="flex cursor-pointer items-center gap-2 self-end pb-2 text-sm text-ink-950">
                  <input
                    type="checkbox"
                    checked={form.hasBoxAndPapers}
                    onChange={(event) =>
                      setForm({ ...form, hasBoxAndPapers: event.target.checked })
                    }
                    className="h-4 w-4 accent-ink-950"
                  />
                  Acompanha caixa e documentos
                </label>
              </FormGrid>
            </section>
          </div>
        </Modal>
      )}
    </>
  )
}

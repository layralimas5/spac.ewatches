import { useMemo, useState } from 'react'
import { useFinanceEntries } from '@/application/use-store'
import { financeStore, newId } from '@/infra'
import {
  categoriesByKind,
  entryCategoryLabel,
  entryKindLabel,
  isInMonth,
  marginPercent,
  summarize,
  type EntryCategory,
  type EntryKind,
  type FinanceEntry,
} from '@/domain/finance'
import { formatDate, formatMoney, formatMoneyShort, formatPercent, parseMoney, todayInputValue } from '@/lib/format'
import { Badge, Card, EmptyState, PageHeader, StatCard, TableWrap, Td, Th } from '@/ui/components/ui'
import { Button, IconButton } from '@/ui/components/Button'
import { Modal } from '@/ui/components/Modal'
import { FormGrid, SelectField, TextField } from '@/ui/components/form'
import { PlusIcon, TrashIcon, WalletIcon } from '@/ui/components/icons'

interface FormState {
  kind: EntryKind
  category: EntryCategory
  description: string
  amount: string
  date: string
}

function emptyForm(): FormState {
  return {
    kind: 'saida',
    category: 'compra',
    description: '',
    amount: '',
    date: todayInputValue(),
  }
}

export default function FinanceiroPage() {
  const entries = useFinanceEntries()
  const [monthOffset, setMonthOffset] = useState(0)
  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const reference = useMemo(() => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - monthOffset)
    return date
  }, [monthOffset])

  const monthEntries = useMemo(
    () =>
      entries
        .filter((entry) => isInMonth(entry.date, reference))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [entries, reference],
  )

  const summary = summarize(monthEntries)
  const monthLabel = reference.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  /** Quanto cada categoria pesou nas saídas do mês. */
  const expenseByCategory = useMemo(() => {
    const totals = new Map<EntryCategory, number>()
    for (const entry of monthEntries) {
      if (entry.kind !== 'saida') continue
      totals.set(entry.category, (totals.get(entry.category) ?? 0) + entry.amount)
    }
    return [...totals.entries()].sort((a, b) => b[1] - a[1])
  }, [monthEntries])

  const save = () => {
    if (form === null) return

    const nextErrors: Record<string, string> = {}
    if (form.description.trim() === '') nextErrors['description'] = 'Descreva o lançamento.'
    if (parseMoney(form.amount) <= 0) nextErrors['amount'] = 'Informe um valor maior que zero.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    financeStore.upsert({
      id: newId(),
      kind: form.kind,
      category: form.category,
      description: form.description.trim(),
      amount: parseMoney(form.amount),
      date: form.date,
    })

    setForm(null)
  }

  const remove = (entry: FinanceEntry) => {
    if (window.confirm(`Excluir o lançamento "${entry.description}"?`)) {
      financeStore.remove(entry.id)
    }
  }

  return (
    <>
      <PageHeader
        title="Financeiro"
        description="Entradas e saídas do mês. Pedido marcado como pago entra aqui sozinho, com o valor do pedido."
        action={
          <Button
            onClick={() => {
              setErrors({})
              setForm(emptyForm())
            }}
          >
            <PlusIcon className="h-4 w-4" />
            Novo lançamento
          </Button>
        }
      />

      <Card className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setMonthOffset(monthOffset + 1)}>
            Mês anterior
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}
            disabled={monthOffset === 0}
          >
            Próximo mês
          </Button>
        </div>
        <p className="text-sm font-medium text-ink-950 capitalize" role="status" aria-live="polite">
          {monthLabel}
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Entradas"
          value={formatMoneyShort(summary.income)}
          hint={`${monthEntries.filter((entry) => entry.kind === 'entrada').length} lançamentos`}
          tone="positive"
          icon={<WalletIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Saídas"
          value={formatMoneyShort(summary.expense)}
          hint={`${monthEntries.filter((entry) => entry.kind === 'saida').length} lançamentos`}
          tone="negative"
        />
        <StatCard
          label="Resultado"
          value={formatMoneyShort(summary.balance)}
          hint={summary.balance >= 0 ? 'Sobrou no mês' : 'Faltou no mês'}
          tone={summary.balance >= 0 ? 'positive' : 'negative'}
        />
        <StatCard
          label="Margem"
          value={formatPercent(marginPercent(summary))}
          hint="Quanto sobra de cada real que entra"
          tone={marginPercent(summary) >= 0 ? 'positive' : 'negative'}
        />
      </div>

      {expenseByCategory.length > 0 && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-950">Para onde foi o dinheiro</h2>
          <ul className="mt-4 list-none space-y-3">
            {expenseByCategory.map(([category, total]) => {
              const share = summary.expense === 0 ? 0 : (total / summary.expense) * 100
              return (
                <li key={category}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-ink-700">{entryCategoryLabel[category]}</span>
                    <span className="tabular font-medium text-ink-950">
                      {formatMoney(total)}
                      <span className="ml-2 text-xs font-normal text-ink-400">
                        {formatPercent(share)}
                      </span>
                    </span>
                  </div>
                  {/* Barra decorativa: o número ao lado já diz tudo para quem usa leitor de tela. */}
                  <div aria-hidden="true" className="mt-1.5 h-1.5 rounded-full bg-paper-alt">
                    <div
                      className="h-full rounded-full bg-ink-950"
                      style={{ width: `${Math.max(2, share)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      )}

      <Card>
        {monthEntries.length === 0 ? (
          <EmptyState
            title="Nenhum lançamento neste mês"
            description="Registre uma entrada ou saída, ou marque um pedido como pago para a venda entrar sozinha."
          />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Descrição</Th>
                <Th>Categoria</Th>
                <Th className="text-right">Valor</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {monthEntries.map((entry) => (
                <tr key={entry.id}>
                  <Td className="tabular whitespace-nowrap text-ink-500">{formatDate(entry.date)}</Td>
                  <Td className="text-ink-950">{entry.description}</Td>
                  <Td>
                    <Badge tone={entry.kind === 'entrada' ? 'positive' : 'neutral'}>
                      {entryCategoryLabel[entry.category]}
                    </Badge>
                  </Td>
                  <Td className="tabular text-right font-medium">
                    <span className={entry.kind === 'entrada' ? 'text-positive' : 'text-negative'}>
                      {entry.kind === 'entrada' ? '+' : '−'} {formatMoney(entry.amount)}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex justify-end">
                      <IconButton
                        label={`Excluir lançamento ${entry.description}`}
                        tone="danger"
                        onClick={() => remove(entry)}
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
          title="Novo lançamento"
          description="Entradas somam, saídas subtraem. O valor entra sempre positivo."
          onClose={() => setForm(null)}
          footer={
            <>
              <Button variant="outline" onClick={() => setForm(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar lançamento</Button>
            </>
          }
        >
          <FormGrid>
            <SelectField
              id="kind"
              label="Tipo"
              value={form.kind}
              onChange={(value) => {
                // Trocar o lado do caixa troca as categorias possíveis, então a
                // categoria escolhida antes pode não existir mais.
                const first = categoriesByKind[value][0] ?? 'outros'
                setForm({ ...form, kind: value, category: first })
              }}
              options={(Object.keys(entryKindLabel) as EntryKind[]).map((kind) => ({
                value: kind,
                label: entryKindLabel[kind],
              }))}
            />
            <SelectField
              id="category"
              label="Categoria"
              value={form.category}
              onChange={(value) => setForm({ ...form, category: value })}
              options={categoriesByKind[form.kind].map((category) => ({
                value: category,
                label: entryCategoryLabel[category],
              }))}
            />
            <TextField
              id="description"
              label="Descrição"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              placeholder="Compra da peça, frete, anúncio"
              className="sm:col-span-2"
              {...(errors['description'] !== undefined && { error: errors['description'] })}
            />
            <TextField
              id="amount"
              label="Valor (R$)"
              value={form.amount}
              inputMode="decimal"
              placeholder="0,00"
              onChange={(value) => setForm({ ...form, amount: value })}
              {...(errors['amount'] !== undefined && { error: errors['amount'] })}
            />
            <TextField
              id="date"
              label="Data"
              type="date"
              value={form.date}
              onChange={(value) => setForm({ ...form, date: value })}
            />
          </FormGrid>
        </Modal>
      )}
    </>
  )
}

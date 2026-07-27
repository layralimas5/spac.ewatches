import { useState } from 'react'
import { useSettings } from '@/application/use-settings'
import {
  customerStore,
  deliveryStore,
  financeStore,
  orderStore,
  productStore,
  resetAll,
  settingsStore,
} from '@/infra'
import type { Settings } from '@/domain/settings'
import { formatPhone } from '@/lib/format'
import { Card, CardHeader, PageHeader } from '@/ui/components/ui'
import { Button } from '@/ui/components/Button'
import { FormGrid, TextField } from '@/ui/components/form'
import { DownloadIcon } from '@/ui/components/icons'

/** Tudo que o sistema guarda, num arquivo só. */
function buildBackup(): string {
  return JSON.stringify(
    {
      geradoEm: new Date().toISOString(),
      versao: 1,
      produtos: productStore.getAll(),
      clientes: customerStore.getAll(),
      pedidos: orderStore.getAll(),
      entregas: deliveryStore.getAll(),
      financeiro: financeStore.getAll(),
      ajustes: settingsStore.get(),
    },
    null,
    2,
  )
}

export default function ConfiguracoesPage() {
  const settings = useSettings()
  const [draft, setDraft] = useState<Settings>(settings)
  const [saved, setSaved] = useState(false)

  const save = () => {
    settingsStore.set({
      ...draft,
      storePhone: draft.storePhone.replace(/\D/g, ''),
      defaultMinStock: Math.max(0, Number(draft.defaultMinStock) || 0),
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  const downloadBackup = () => {
    const blob = new Blob([buildBackup()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `space-watches-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const restoreDemo = () => {
    const confirmed = window.confirm(
      'Isso apaga tudo que você cadastrou e volta aos dados de demonstração. Continuar?',
    )
    if (confirmed) resetAll()
  }

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Quem opera, dados da loja e o que fazer com a base guardada neste navegador."
      />

      <Card>
        <CardHeader title="Identificação" description="Aparece no topo do sistema" />
        <div className="space-y-4 p-5">
          <FormGrid>
            <TextField
              id="operatorName"
              label="Quem opera"
              value={draft.operatorName}
              onChange={(value) => setDraft({ ...draft, operatorName: value })}
            />
            <TextField
              id="storeName"
              label="Nome da loja"
              value={draft.storeName}
              onChange={(value) => setDraft({ ...draft, storeName: value })}
            />
            <TextField
              id="storePhone"
              label="WhatsApp da loja"
              value={formatPhone(draft.storePhone)}
              inputMode="tel"
              placeholder="(11) 98765-4321"
              onChange={(value) => setDraft({ ...draft, storePhone: value })}
            />
            <TextField
              id="defaultMinStock"
              label="Estoque mínimo padrão"
              type="number"
              value={String(draft.defaultMinStock)}
              onChange={(value) => setDraft({ ...draft, defaultMinStock: Number(value) })}
              hint="Sugerido ao cadastrar peça nova"
            />
          </FormGrid>

          <div className="flex items-center gap-3">
            <Button onClick={save}>Salvar</Button>
            {saved && (
              <span className="text-sm text-positive" role="status">
                Salvo.
              </span>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Backup dos dados"
          description="Os dados vivem neste navegador. O backup é a única cópia fora dele."
        />
        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-ink-500">
            Baixe um arquivo com tudo que está cadastrado: peças, clientes, pedidos, entregas e
            lançamentos. Vale guardar um por semana enquanto o banco de dados não existir, porque
            limpar os dados do navegador apaga o sistema inteiro.
          </p>

          <Button variant="outline" onClick={downloadBackup}>
            <DownloadIcon className="h-4 w-4" />
            Baixar backup
          </Button>
        </div>
      </Card>

      <Card className="border-negative/30">
        <CardHeader title="Zona de risco" description="Não tem desfazer" />
        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-ink-500">
            Restaurar a demonstração apaga tudo que você cadastrou e volta ao conteúdo de exemplo
            que veio no sistema. Serve para começar do zero depois de testar.
          </p>

          <Button variant="danger" onClick={restoreDemo}>
            Restaurar dados de demonstração
          </Button>
        </div>
      </Card>
    </>
  )
}

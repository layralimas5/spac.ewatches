import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/ui/components/Seo'
import { buttonStyles } from '@/ui/components/Button'
import { TruckIcon, WhatsAppIcon } from '@/ui/components/icons'
import { contactChannelLabel, orderTrackingLink } from '@/lib/whatsapp'
import { cn } from '@/lib/cn'

/**
 * Rastreio do pedido.
 *
 * Hoje o acompanhamento vive na conversa do WhatsApp, então a página não
 * promete um status que ela não tem: pega o código, valida o formato e abre o
 * atendimento já com o pedido identificado.
 *
 * Quando o sistema de gestão existir, a consulta real entra neste mesmo campo
 * e o cliente não precisa reaprender nada.
 */
export default function TrackOrderPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = code.trim()
    if (trimmed === '') {
      setError('Digite o número do pedido para continuar.')
      return
    }

    setError(null)
    window.open(orderTrackingLink(trimmed), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Seo
        title="Rastrear pedido"
        description="Acompanhe o seu pedido na Space Watches. Informe o número do pedido e falamos com você pelo WhatsApp com a posição da entrega."
        path="/rastreio"
      />

      <div className="container-brand py-14 sm:py-20">
        <div className="mx-auto max-w-xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-alt text-ink-950">
            <TruckIcon className="h-6 w-6" />
          </span>

          <h1 className="mt-5 text-2xl text-ink-950 sm:text-3xl">Rastrear pedido</h1>

          <p className="mt-3 leading-relaxed text-ink-500">
            Informe o número que você recebeu ao finalizar a compra. Ele começa com
            <span className="text-ink-950"> SW-</span> e está no topo da conversa do pedido.
          </p>

          <form onSubmit={submit} className="mt-8">
            <label htmlFor="codigo-pedido" className="block text-xs font-medium text-ink-500">
              Número do pedido
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              {/*
                Campo alto e com fonte grande: é o único campo da página e o
                código é uma sequência sem sentido para quem digita, então
                precisa aparecer grande o bastante para conferir letra a letra.
              */}
              <input
                id="codigo-pedido"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="SW-M8QK2P"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                aria-invalid={error !== null}
                aria-describedby={error !== null ? 'codigo-erro' : undefined}
                className={cn(
                  // No celular ele é o alvo principal da tela; no desktop volta
                  // aos 48px do botão ao lado, para os dois ficarem alinhados.
                  'h-14 w-full min-w-0 flex-1 rounded-md border bg-paper px-4 text-base tracking-wide text-ink-950 sm:h-12',
                  'placeholder:tracking-normal placeholder:text-ink-500/70 focus:border-ink-950',
                  error !== null ? 'border-ink-950' : 'border-paper-line',
                )}
              />

              <button type="submit" className={`${buttonStyles('primary', 'lg')} shrink-0`}>
                <WhatsAppIcon className="h-5 w-5" />
                {`Consultar no ${contactChannelLabel()}`}
              </button>
            </div>

            {error !== null && (
              <p id="codigo-erro" role="alert" className="mt-2 text-sm text-ink-950">
                {error}
              </p>
            )}
          </form>

          <div className="mt-10 rounded-lg border border-paper-line bg-paper-alt p-5">
            <h2 className="text-sm font-semibold text-ink-950">Perdeu o número do pedido?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Sem problema. Fale com a gente pelo mesmo número em que a compra foi combinada, que
              localizamos o pedido pelo seu nome ou CPF.
            </p>
            <Link to="/meus-pedidos" className="mt-4 inline-block text-sm text-ink-950 underline underline-offset-4">
              Ver como funciona o acompanhamento
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

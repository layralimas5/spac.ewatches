import { Link } from 'react-router-dom'
import { Seo } from '@/ui/components/Seo'
import { buttonStyles } from '@/ui/components/Button'
import { TruckIcon, UserIcon, WhatsAppIcon } from '@/ui/components/icons'
import { contactChannelLabel, generalContactLink } from '@/lib/whatsapp'

const steps: ReadonlyArray<{ title: string; text: string }> = [
  {
    title: 'Você finaliza o pedido no site',
    text: 'O carrinho vira uma mensagem com itens, endereço, frete e total, e o pedido ganha um número que começa com SW-.',
  },
  {
    title: 'A conversa continua no atendimento',
    text: 'Pagamento e prazo são combinados por lá, com a pessoa que vende. Sem robô no meio.',
  },
  {
    title: 'A gente avisa a cada etapa',
    text: 'Separação, envio e entrega chegam na mesma conversa, junto com o código de rastreio dos Correios quando a peça é postada.',
  },
]

/**
 * "Meus pedidos" enquanto não existe cadastro.
 *
 * A página não finge uma área logada: explica onde o pedido vive de verdade e
 * leva para o rastreio e para o atendimento. Quando o sistema de gestão entrar
 * com login, esta rota vira o histórico real, mantendo a mesma URL.
 */
export default function MyOrdersPage() {
  return (
    <>
      <Seo
        title="Meus pedidos"
        description="Como acompanhar o seu pedido na Space Watches: número do pedido, rastreio e atendimento direto com quem vende."
        path="/meus-pedidos"
      />

      <div className="container-brand py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-alt text-ink-950">
            <UserIcon className="h-6 w-6" />
          </span>

          <h1 className="mt-5 text-2xl text-ink-950 sm:text-3xl">Meus pedidos</h1>

          <p className="mt-3 leading-relaxed text-ink-500">
            A Space Watches não pede cadastro para comprar. Seu pedido fica registrado com um número
            e acompanhado direto no atendimento, sem senha para lembrar.
          </p>

          <ol className="mt-10 list-none space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper-line text-sm font-semibold text-ink-950"
                >
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-base font-medium text-ink-950">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/rastreio" className={buttonStyles('primary', 'lg')}>
              <TruckIcon className="h-5 w-5" />
              Rastrear meu pedido
            </Link>
            <a
              href={generalContactLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles('outline', 'lg')}
            >
              <WhatsAppIcon className="h-5 w-5" />
              {`Falar no ${contactChannelLabel()}`}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

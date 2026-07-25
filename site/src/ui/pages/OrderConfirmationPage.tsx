import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/ui/components/Seo'
import { buttonStyles } from '@/ui/components/Button'
import { CheckIcon, WhatsAppIcon } from '@/ui/components/icons'
import { contactChannelLabel, generalContactLink } from '@/lib/whatsapp'

export default function OrderConfirmationPage() {
  const { code } = useParams<{ code: string }>()

  return (
    <>
      {/* Página de pedido não deve entrar em índice de busca. */}
      <meta name="robots" content="noindex" />
      <Seo
        title="Pedido registrado"
        description="Seu pedido na Space Watches foi registrado."
        path={`/pedido/${code ?? ''}`}
      />

      <div className="container-brand flex flex-col items-center py-20 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
          <CheckIcon className="h-7 w-7" />
        </span>

        <h1 className="mt-6 text-2xl text-ink-950 sm:text-3xl">Pedido registrado</h1>

        {code !== undefined && (
          <p className="mt-3 rounded-md bg-paper-alt px-4 py-2 text-sm text-ink-950">
            {`Número do pedido: ${code}`}
          </p>
        )}

        <p className="mt-5 max-w-lg leading-relaxed text-ink-500">
          Abrimos uma conversa no WhatsApp com o resumo completo — itens, endereço, frete e total.
          É por lá que combinamos o pagamento e a gente te avisa a cada etapa até a entrega.
        </p>

        <p className="mt-3 max-w-lg text-sm text-ink-500">
          Se a janela não abriu, seu navegador pode ter bloqueado o pop-up. Use o botão abaixo.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={generalContactLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles('primary', 'lg')}
          >
            <WhatsAppIcon className="h-5 w-5" />
            {`Abrir o ${contactChannelLabel()}`}
          </a>
          <Link to="/catalogo" className={buttonStyles('outline-light', 'lg')}>
            Continuar comprando
          </Link>
        </div>
      </div>
    </>
  )
}

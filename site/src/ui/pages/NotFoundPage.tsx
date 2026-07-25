import { Link } from 'react-router-dom'
import { Seo } from '@/ui/components/Seo'
import { buttonStyles } from '@/ui/components/Button'
import { WatchIcon } from '@/ui/components/icons'

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Página não encontrada"
        description="A página que você procurava não existe. Veja o catálogo de relógios importados da Space Watches."
        path="/404"
      />

      <div className="container-brand flex flex-col items-center py-28 text-center">
        <WatchIcon className="h-12 w-12 text-ink-950" />
        <p className="eyebrow mt-8 text-ink-950">Erro 404</p>
        <h1 className="mt-3 font-display text-4xl text-ink-950">Essa página não existe</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ink-500">
          O link pode estar errado ou a página pode ter saído do ar. O catálogo continua aqui.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to="/catalogo" className={buttonStyles('primary', 'lg')}>
            Ver catálogo
          </Link>
          <Link to="/" className={buttonStyles('ghost', 'lg')}>
            Voltar ao início
          </Link>
        </div>
      </div>
    </>
  )
}

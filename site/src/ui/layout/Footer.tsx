import { Link } from 'react-router-dom'
import { Logo } from '@/ui/components/Logo'
import { InstagramIcon, WhatsAppIcon } from '@/ui/components/icons'
import { siteConfig } from '@/config/site.config'
import { contactChannelLabel, generalContactLink } from '@/lib/whatsapp'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-950 text-cream">
      <div className="container-brand grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo tone="dark" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Relógios importados originais, com caixa e documentos. E o modelo que você quer,
            trazido sob encomenda.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <h2 className="eyebrow text-cream">Navegar</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/catalogo" className="text-muted transition-colors hover:text-cream">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/importacao" className="text-muted transition-colors hover:text-cream">
                Importação sob encomenda
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-cream">Contato</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={generalContactLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-cream"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {contactChannelLabel()}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-cream"
              >
                <InstagramIcon className="h-4 w-4" />
                {`@${siteConfig.instagram.handle}`}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-700">
        <div className="container-brand flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{`© ${year} ${siteConfig.name}. Todos os direitos reservados.`}</p>
          <p>Relógios originais, com procedência verificada.</p>
        </div>
      </div>
    </footer>
  )
}

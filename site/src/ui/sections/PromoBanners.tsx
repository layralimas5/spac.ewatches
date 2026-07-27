import { Link } from 'react-router-dom'

const banners = [
  {
    to: '/catalogo?disponibilidade=pronta-entrega',
    eyebrow: 'Em mãos',
    title: 'Pronta-entrega',
    description: 'Peças disponíveis agora, com envio combinado no atendimento.',
    tone: 'dark' as const,
  },
  {
    to: '/importacao',
    eyebrow: 'Sob encomenda',
    title: 'Importação personalizada',
    description: 'Você manda a referência, a gente cota valor e prazo antes de você aprovar.',
    tone: 'light' as const,
  },
]

/**
 * Faixa de dois banners entre as grades de produto, como a referência usa.
 *
 * Um escuro e um claro: sem cor de acento na paleta, a distinção entre os dois
 * blocos precisa vir da inversão de fundo.
 */
export function PromoBanners() {
  return (
    <section className="container-brand py-4" aria-label="Destaques da loja">
      <ul className="grid list-none gap-4 sm:grid-cols-2">
        {banners.map((banner) => (
          <li key={banner.to}>
            <Link
              to={banner.to}
              className={
                banner.tone === 'dark'
                  ? 'group flex h-full flex-col justify-between rounded-lg bg-ink-950 p-6 text-cream transition-colors hover:bg-ink-900 sm:p-8'
                  : 'group flex h-full flex-col justify-between rounded-lg border border-paper-line bg-paper-alt p-6 text-ink-950 transition-colors hover:border-ink-950 sm:p-8'
              }
            >
              <div>
                <p
                  className={
                    banner.tone === 'dark' ? 'eyebrow text-muted' : 'eyebrow text-ink-400'
                  }
                >
                  {banner.eyebrow}
                </p>
                <h2 className="mt-2 text-lg font-semibold sm:text-2xl">{banner.title}</h2>
                <p
                  className={
                    banner.tone === 'dark'
                      ? 'mt-2 max-w-sm text-sm leading-relaxed text-muted'
                      : 'mt-2 max-w-sm text-sm leading-relaxed text-ink-500'
                  }
                >
                  {banner.description}
                </p>
              </div>

              <span className="mt-6 text-sm underline underline-offset-4">Ver peças</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

import { Reveal } from '@/ui/components/Reveal'
import { BoxIcon, GlobeIcon, ShieldIcon } from '@/ui/components/icons'

const pillars = [
  {
    icon: ShieldIcon,
    title: 'Original, sempre',
    description:
      'Nada de réplica. Cada peça é verificada antes de sair daqui — se não for original, não entra no catálogo.',
  },
  {
    icon: BoxIcon,
    title: 'Caixa e documentos',
    description:
      'O relógio chega completo, com a documentação que comprova a procedência e sustenta o valor de revenda.',
  },
  {
    icon: GlobeIcon,
    title: 'Importação sob encomenda',
    description:
      'Não achou o modelo? A gente importa. Você diz a referência, a gente cuida da busca, do trâmite e do prazo.',
  },
] as const

/**
 * Em relógio importado, a objeção não é preço — é "isso é original mesmo?".
 * Esta seção existe pra responder isso antes de o visitante perguntar.
 */
export function TrustPillars() {
  return (
    // Segundo bloco escuro da página. Responde a objeção de originalidade, que é
    // a que trava a venda — o fundo invertido faz a seção parar o olho.
    <section className="bg-ink-950 text-cream" aria-labelledby="confianca">
      <div className="container-brand py-20 sm:py-24">
        <h2 id="confianca" className="max-w-2xl font-display text-3xl text-cream sm:text-4xl">
          Comprar importado sem apostar na sorte
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.1}>
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gold-600/40 bg-gold-500/10 text-gold-400">
                  <pillar.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl text-cream">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { Reveal } from '@/ui/components/Reveal'
import { buttonStyles } from '@/ui/components/Button'
import { ArrowRightIcon, WhatsAppIcon } from '@/ui/components/icons'
import { contactChannelLabel, customImportLink } from '@/lib/whatsapp'

const steps = [
  { number: '01', title: 'Você diz o modelo', description: 'Marca, referência ou só uma foto. Serve.' },
  { number: '02', title: 'A gente cota', description: 'Busca a peça, confirma procedência e fecha valor e prazo com você.' },
  { number: '03', title: 'Importamos e entregamos', description: 'Você acompanha até o relógio chegar na sua mão.' },
] as const

/**
 * Fecha a home no fundo claro padrão, logo depois do bloco escuro dos pilares.
 * A alternância clara → escura → clara é o que dá ritmo à página.
 */
export function CustomImportCta() {
  return (
    <section className="bg-paper text-ink-950" aria-labelledby="importacao">
      <div className="container-brand py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-gold-600">Importação personalizada</p>
            <h2 id="importacao" className="mt-3 font-display text-3xl text-ink-950 sm:text-4xl">
              Não está no catálogo? A gente traz.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-500">
              O catálogo é o que temos hoje — não o limite do que dá pra conseguir. Se você já sabe o
              modelo que quer, manda a referência que a gente cota a importação.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={customImportLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles('primary', 'lg')}
              >
                <WhatsAppIcon className="h-4 w-4" />
                {`Pedir cotação no ${contactChannelLabel()}`}
              </a>

              <Link to="/importacao" className={buttonStyles('ghost-light', 'lg')}>
                Como funciona
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <ol className="space-y-px overflow-hidden rounded-xl border border-paper-line">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08}>
                <li className="flex gap-5 bg-paper-alt p-6">
                  <span className="font-display text-2xl text-gold-600" aria-hidden="true">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-medium text-ink-950">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

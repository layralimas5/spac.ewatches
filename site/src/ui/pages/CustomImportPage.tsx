import { Link } from 'react-router-dom'
import { Seo } from '@/ui/components/Seo'
import { Reveal } from '@/ui/components/Reveal'
import { buttonStyles } from '@/ui/components/Button'
import { ArrowRightIcon, WhatsAppIcon } from '@/ui/components/icons'
import { contactChannelLabel, customImportLink } from '@/lib/whatsapp'

/**
 * Amplitude menor que a do card: o botão é um alvo pequeno, e um pulsar largo
 * demais deslocaria a borda o suficiente para o cursor escapar do hover.
 */
const buttonPulse = 'hover-pulse [--pulse-scale:1.03]'

const steps = [
  {
    number: '01',
    title: 'Você manda o modelo',
    description:
      'Marca e referência, um print do site oficial ou até uma foto que você viu por aí. Qualquer uma das três serve pra gente identificar a peça.',
  },
  {
    number: '02',
    title: 'A gente busca e cota',
    description:
      'Procuramos a peça com nossos fornecedores, confirmamos a procedência e voltamos com valor fechado e prazo estimado. Sem surpresa depois.',
  },
  {
    number: '03',
    title: 'Você aprova',
    description:
      'Só seguimos com a compra depois do seu ok no valor e no prazo. Combinamos a forma de pagamento no atendimento.',
  },
  {
    number: '04',
    title: 'Importamos e entregamos',
    description:
      'A gente acompanha o trâmite e te atualiza até o relógio chegar na sua mão, com caixa e documentos.',
  },
] as const

const faq = [
  {
    question: 'Dá pra trazer qualquer modelo?',
    answer:
      'Quase sempre. Peças de produção corrente são as mais simples. Edições limitadas e modelos descontinuados dependem de disponibilidade no mercado, nesses casos a gente avisa antes de você se comprometer com qualquer coisa.',
  },
  {
    question: 'Quanto tempo demora?',
    answer:
      'Depende do modelo e da origem. O prazo é estimado junto com a cotação, antes de você aprovar. Preferimos dar um prazo real a um prazo bonito.',
  },
  {
    question: 'Como sei que é original?',
    answer:
      'Toda peça é verificada antes da entrega e vai com caixa e documentos. Se em algum momento a procedência não fechar, a compra não acontece.',
  },
  {
    question: 'Preciso pagar tudo adiantado?',
    answer:
      'Não. As condições são combinadas no atendimento, caso a caso, junto com a cotação.',
  },
] as const

export default function CustomImportPage() {
  return (
    <>
      <Seo
        title="Importação personalizada de relógios"
        description="Você escolhe o modelo, a Space Watches importa. Cotação com valor e prazo fechados antes de você aprovar, com caixa e documentos originais."
        path="/importacao"
      />

      <div className="container-brand py-14 sm:py-20">
        <header className="max-w-3xl">
          <p className="eyebrow text-ink-950">Importação personalizada</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] text-ink-950 sm:text-5xl">
            O modelo que você quer, mesmo que não esteja no catálogo
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-500 sm:text-lg">
            O catálogo mostra o que temos hoje, não o que dá pra conseguir. Se você já sabe o
            relógio que quer, a gente busca, cota e importa pra você.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={customImportLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles('primary', 'lg', buttonPulse)}
            >
              <WhatsAppIcon className="h-5 w-5" />
              {`Pedir cotação no ${contactChannelLabel()}`}
            </a>
            <Link to="/catalogo" className={buttonStyles('ghost', 'lg', buttonPulse)}>
              Ver o que já temos
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="mt-20" aria-labelledby="como-funciona">
          <h2 id="como-funciona" className="font-display text-3xl text-ink-950">
            Como funciona
          </h2>

          <ol className="mt-10 grid list-none gap-6 sm:grid-cols-2">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08} className="h-full">
                {/*
                 * O `li` é só a área de hover, de tamanho fixo. Quem pulsa é o
                 * cartão de dentro, senão a borda passaria por baixo do cursor a
                 * cada ciclo e a animação ficaria piscando.
                 */}
                <li className="group h-full">
                  <div className="hover-pulse h-full rounded-xl border border-paper-line bg-paper-alt p-6 [--pulse-scale:1.02]">
                    <span className="font-display text-2xl text-ink-500" aria-hidden="true">
                      {step.number}
                    </span>
                    <h3 className="mt-3 font-display text-lg text-ink-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="mt-20" aria-labelledby="duvidas">
          <h2 id="duvidas" className="font-display text-3xl text-ink-950">
            Dúvidas frequentes
          </h2>

          <dl className="mt-8 divide-y divide-paper-line border-y border-paper-line">
            {faq.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-medium text-ink-950">{item.question}</dt>
                <dd className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-500">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-20 rounded-2xl border border-paper-line bg-paper-alt px-6 py-14 text-center sm:px-12">
          <h2 className="font-display text-3xl text-ink-950">Já sabe qual relógio quer?</h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink-500">
            Manda a referência que a gente volta com a cotação. Sem compromisso até você aprovar.
          </p>
          <a
            href={customImportLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles('primary', 'lg', `${buttonPulse} mt-8`)}
          >
            <WhatsAppIcon className="h-5 w-5" />
            {`Pedir cotação no ${contactChannelLabel()}`}
          </a>
        </section>
      </div>
    </>
  )
}

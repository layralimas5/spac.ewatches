import { BoxIcon, ShieldIcon, WatchIcon, WhatsAppIcon } from '@/ui/components/icons'

const benefits = [
  { icon: ShieldIcon, title: 'Original, sempre', text: 'Sem réplica, com procedência verificada.' },
  { icon: BoxIcon, title: 'Caixa e documentos', text: 'A peça chega completa.' },
  { icon: WatchIcon, title: 'Parcelamento', text: 'Em até 12x sem juros.' },
  { icon: WhatsAppIcon, title: 'Atendimento direto', text: 'Você fala com quem vende.' },
]

/**
 * Faixa de benefícios acima do rodapé, estática, ao contrário da barra
 * promocional do topo, que rola.
 *
 * Duas faixas em movimento na mesma página competem entre si e nenhuma é lida.
 */
export function BenefitsStrip() {
  return (
    <section className="border-y border-paper-line bg-paper-alt" aria-label="Por que comprar aqui">
      <ul className="container-brand grid list-none gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <li key={benefit.title} className="flex items-start gap-3">
            <benefit.icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-950" />
            <div>
              <p className="text-sm font-medium text-ink-950">{benefit.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{benefit.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

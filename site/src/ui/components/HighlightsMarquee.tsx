import type { ComponentType, SVGProps } from 'react'
import { BoxIcon, GlobeIcon, ShieldIcon, WatchIcon, WhatsAppIcon } from './icons'

interface Highlight {
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>
  readonly label: string
}

/**
 * Afirmações que a loja sustenta de fato — nada de número inventado.
 * Quando houver métrica real (peças entregues, clientes atendidos, tempo médio
 * de importação), é aqui que ela entra.
 */
const highlights: readonly Highlight[] = [
  { icon: ShieldIcon, label: '100% peças originais' },
  { icon: BoxIcon, label: 'Caixa e documentos inclusos' },
  { icon: GlobeIcon, label: 'Importação sob encomenda' },
  { icon: WatchIcon, label: 'Procedência verificada' },
  { icon: ShieldIcon, label: 'Garantia em todas as peças' },
  { icon: WhatsAppIcon, label: 'Atendimento direto no WhatsApp' },
]

function HighlightList({ hidden = false }: { readonly hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 list-none items-center" aria-hidden={hidden || undefined}>
      {highlights.map((item) => (
        <li key={item.label} className="flex items-center gap-2.5 px-7 py-4 whitespace-nowrap">
          <item.icon className="h-4 w-4 shrink-0 text-gold-600" />
          <span className="eyebrow text-ink-500">{item.label}</span>
          <span className="ml-7 h-1 w-1 rounded-full bg-gold-600/40" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}

/**
 * Faixa de destaques abaixo do header, rolando para a esquerda sem fim.
 *
 * A lista aparece duas vezes: a primeira é o conteúdo real, a segunda é só o
 * preenchimento que torna o loop contínuo — e por isso sai da árvore de
 * acessibilidade, senão o leitor de tela anuncia tudo em dobro.
 */
export function HighlightsMarquee() {
  return (
    <section
      className="marquee-viewport relative overflow-hidden border-b border-paper-line bg-paper-alt"
      aria-label="Destaques da Space Watches"
    >
      {/* Esfumaça as pontas pra faixa não parecer cortada na borda da tela. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper-alt to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper-alt to-transparent"
      />

      <div className="marquee-track">
        <HighlightList />
        <HighlightList hidden />
      </div>
    </section>
  )
}

import { announcements } from '@/config/navigation'

function AnnouncementList({ hidden = false }: { readonly hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 list-none items-center" aria-hidden={hidden || undefined}>
      {announcements.map((text) => (
        <li key={text} className="flex items-center gap-6 px-6 py-2 whitespace-nowrap">
          <span className="eyebrow text-cream/90">{text}</span>
          <span className="h-1 w-1 rounded-full bg-gold-500" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}

/**
 * Faixa preta no topo absoluto da página, acima do header — o lugar onde o
 * varejo brasileiro anuncia frete grátis e condição de parcelamento.
 *
 * A lista aparece duas vezes: a segunda é só o preenchimento que torna o loop
 * contínuo, e por isso sai da árvore de acessibilidade.
 */
export function AnnouncementBar() {
  return (
    <div className="marquee-viewport overflow-hidden bg-ink-950" aria-label="Avisos da loja">
      <div className="marquee-track">
        <AnnouncementList />
        <AnnouncementList hidden />
      </div>
    </div>
  )
}

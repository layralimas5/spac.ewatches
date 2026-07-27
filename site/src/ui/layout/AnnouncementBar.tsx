import { announcements } from '@/config/navigation'
import { Marquee } from '@/ui/components/Marquee'

/**
 * Faixa preta no topo absoluto da página, acima do header: o lugar onde o
 * varejo brasileiro anuncia frete grátis e condição de parcelamento.
 */
export function AnnouncementBar() {
  return <Marquee items={announcements} ariaLabel="Avisos da loja" tone="dark" />
}

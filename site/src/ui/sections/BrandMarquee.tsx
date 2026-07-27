import { Marquee } from '@/ui/components/Marquee'

/**
 * Mini faixa logo abaixo do banner, contando como a loja opera.
 *
 * Fala da operação (o que a Space Watches faz e como), não das vantagens de
 * comprar: a lista de benefícios fica na faixa estática acima do rodapé, e
 * repetir o mesmo texto nos dois lugares esvazia os dois.
 *
 * Roda mais devagar que a barra de avisos do topo para as duas faixas não
 * disputarem o olho na mesma tela.
 */
const facts: readonly string[] = [
  'Relógios importados originais',
  'Procedência verificada antes de qualquer venda',
  'Importação personalizada de qualquer modelo',
  'Cada peça com caixa e documentos',
  'Envio para todo o Brasil',
  'Atendimento direto com quem vende',
]

export function BrandMarquee() {
  return <Marquee items={facts} ariaLabel="Sobre a Space Watches" tone="light" durationSeconds={60} />
}

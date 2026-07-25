# Identidade visual — Space Watches

> **Preto, branco e cinza. Nenhuma outra cor.** Decisão da loja.
>
> O dourado do logo saiu da interface do site. Ele continua existindo no arquivo
> `identidade/logo.png`, mas não é mais cor de sistema.

---

## Cores

Sem cor de acento, a hierarquia vem de **peso, tamanho e contraste** — nunca de cor.
Escala neutra de verdade (R=G=B), sem viés quente ou frio.

| Papel | Hex |
| --- | --- |
| Preto / texto principal | `#0A0A0A` |
| Escuro secundário (hover do CTA) | `#262626` |
| Cinza de corpo sobre branco (7,4:1) | `#525252` |
| Cinza de apoio, rótulos (4,6:1) | `#737373` |
| Linha e borda | `#E5E5E5` |
| Fundo alternativo / cards | `#F5F5F5` |
| Branco / fundo padrão | `#FFFFFF` |
| Texto de apoio sobre fundo escuro | `#A3A3A3` |

- **CTA principal:** retângulo **preto sólido com texto branco**. Num site branco, o
  bloco preto é o maior contraste possível da tela — ele é o ponto mais forte sem
  precisar de cor. Dentro de bloco escuro isso inverte: lá o botão cheio é branco.

- **Selo de desconto:** preto sólido com texto branco, no formato "-30% OFF".

- **Cor a evitar:** qualquer uma. Vermelho de promoção, verde de "compre já", amarelo
  de desconto — nada disso entra.

---

## Tipografia

*(Não informada pela marca — decisão de projeto, ajustar se houver fonte oficial.)*

- **Tudo em sans-serif: Inter.** Título, corpo, botão e preço.

  A primeira versão usava serifada (Playfair) nos títulos. Saiu quando a loja
  escolheu como referência o padrão de e-commerce brasileiro
  (saintgermainbrand.com.br), que é sans em toda a página. Serifada dava ar de
  editorial de luxo; sans lê melhor em grade densa de produto e em preço.

- **Peso do título:** 600 (semibold), com `letter-spacing` levemente negativo.

- **Preço:** 600. É a informação que o olho procura primeiro na grade.

- **Detalhe da marca:** o logo usa **letter-spacing largo em caixa alta** ("W A T C H E S").
  Repetir esse tratamento em rótulos e categorias (`tracking-[0.25em]`, uppercase, tamanho
  pequeno) — sem cor de acento, é a assinatura visual que sobrou da marca.

---

## Estilo geral

**Base clara com blocos escuros.** O site é branco; escuro é usado em pontos escolhidos
— banner do topo, seção de confiança e rodapé. É a alternância entre os dois que dá
ritmo à página.

Referência escolhida pela loja: **saintgermainbrand.com.br** — e-commerce brasileiro
convencional, branco, sans-serif, grade densa de produto com preço, desconto,
parcelamento e botão de compra visíveis no card.

Isso substituiu a primeira leitura (minimalista escuro tipo boutique de luxo).

---

## Elementos-chave

- Bordas: finas e discretas — `1px` em `#E5E5E5` no claro, `#404040` no escuro.
- Border-radius: 6–8px. Card de e-commerce é mais quadrado que card de portfólio.
- Botões: primário preto sólido com texto branco; secundário em contorno preto que
  inverte no hover. Dentro de bloco escuro, os dois invertem.
- Sombras: quase inexistentes. A separação se faz por linha e por tom de fundo.

---

## O que NUNCA fazer

- Introduzir qualquer cor. A paleta é preto, branco e cinza — e só.
- Usar cinza claro (`#737373` ou mais claro) em texto pequeno sobre branco: fica no
  limite do AA. Texto de corpo usa `#525252`.
- Contador de urgência estridente e apelo de liquidação.
- Empilhar mais de uma família tipográfica — é tudo Inter.

---

## Logo

- **Arquivo:** `identidade/logo.png` — marca "Space Watches" com ícone de relógio, dentro
  de um círculo com anel fino, sobre fundo preto.
- **Versão pra fundo claro:** *(não existe ainda — vale produzir)*
- **Onde usar:** header do site, slide final do carrossel (CTA), header de propostas,
  slides de apresentação
- **Tamanho sugerido:** largura entre 120–200px nos HTMLs

---

## Observações adicionais

O nome escrito é **Space Watches**. `spac.ewatches` é só o handle do Instagram — nunca
usar essa grafia em material visual.

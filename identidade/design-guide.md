# Identidade visual — Space Watches

> Cores e valores abaixo foram **derivados do logo** (`identidade/logo.png`), não passados
> pela marca. São aproximações fiéis ao que o arquivo mostra. Se existir um manual oficial,
> substituir os hex por eles.

---

## Cores

- **Fundo principal:** `#0D0D10` — preto profundo, levemente frio. É a base da marca; o
  logo já nasce sobre ele.

- **Cor de destaque / CTA:** `#C9A24C` — dourado quente (o ponteiro do relógio e a palavra
  "WATCHES"). Usar com parcimônia: preço, CTA, detalhe, filete. Dourado em excesso vira
  cafona e derruba o premium.

- **Texto principal:** `#FFFFFF` para títulos, `#B8B8BE` para texto de apoio sobre fundo escuro.

- **Fundo alternativo / cards:** `#16161A` — um degrau acima do fundo, para separar card
  de página sem precisar de borda forte.

- **Selo de desconto:** preto sólido (`#0D0D10`) com texto branco, no formato "30% OFF".

  A referência de e-commerce usa vermelho/laranja aqui. Ficou em preto para não brigar
  com o dourado da marca — o contraste continua forte e o card não vira panfleto de
  liquidação. Se a loja quiser o vermelho de varejo, é uma linha em `WatchCard.tsx`.

- **Cor a evitar:** verde de "compre já", amarelo de desconto e contador de urgência.
  A marca vende relógio original importado; apelo de liquidação derruba o preço
  percebido da peça.

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
  pequeno) — é a assinatura visual mais reconhecível depois do dourado.

---

## Estilo geral

**Base clara com blocos escuros.** O site é branco; escuro é usado em pontos escolhidos
— banner do topo, seção de confiança e rodapé. É a alternância entre os dois que dá
ritmo à página.

Referência escolhida pela loja: **saintgermainbrand.com.br** — e-commerce brasileiro
convencional, branco, sans-serif, grade densa de produto com preço, desconto,
parcelamento e botão de compra visíveis no card.

Isso substituiu a primeira leitura (minimalista escuro tipo boutique de luxo). O dourado
continua sendo cor de detalhe e CTA, e o escuro continua sendo a assinatura da marca —
mas em faixas, não como fundo geral.

---

## Elementos-chave

- Bordas: finas e discretas — `1px` em `#26262C`. O logo usa exatamente esse recurso (anel
  fino em volta do círculo).
- Border-radius dos cards: suave, 8–12px. Nada de card totalmente quadrado nem muito redondo.
- Botões: primário em dourado com texto escuro; secundário em contorno fino dourado sobre
  fundo transparente.
- Sombras: quase inexistentes. Em fundo escuro, separação se faz por tom de fundo, não por
  sombra.

---

## O que NUNCA fazer

- Usar dourado como cor de fundo grande — é cor de detalhe e CTA.
- Usar o dourado `#C9A24C` em **texto pequeno sobre branco**: dá 3,3:1 e reprova em
  contraste AA. Para texto em fundo claro existe o `#8A6D24` (~4,9:1).
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

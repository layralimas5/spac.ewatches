# Banners

Coloque aqui as artes dos banners. Tudo que está nesta pasta é servido na raiz
do site: `public/banners/verao.png` vira `/banners/verao.png`.

Depois de subir o arquivo, rode `npm run images:normalize` (converte para
`.webp` e reduz o peso, sem mexer no enquadramento) e aponte para ele em
`src/config/banners.ts`.

## Medida única: 15:8

Os dois espaços de banner usam a mesma proporção, **15:8**. Exporte em
**1920 x 1024 px**, `.png` ou `.jpg`, que o script converte.

É a mesma medida no celular e no desktop de propósito: assim a arte aparece
inteira nos dois, sem corte que engole metade da foto na tela estreita.

**Deixe o terço esquerdo sem informação importante.** É onde o texto entra, nos
dois espaços, com um véu escuro por cima.

## Carrossel do topo (`bannerSlides`)

No desktop o texto fica sobre a foto, à esquerda. No celular a foto aparece
inteira e o texto vem logo abaixo, sobre o preto da seção.

```ts
{
  id: 'originais',
  // ...
  image: '/banners/01.webp',
  imageAlt: 'Cronógrafo preto no pulso, sobre fundo escuro',
}
```

## Banner largo da home (`wideBanner`)

Fica abaixo dos blocos de pronta-entrega e encomenda. O texto é opcional: sem
`title`, o bloco vira só imagem, sem véu escuro por cima à toa.

```ts
export const wideBanner: WideBannerConfig = {
  image: '/banners/02.webp',
  imageAlt: 'Casal em ambiente noturno, os dois usando relógios de aço',
  to: '/catalogo',
  eyebrow: 'Originais, com procedência',
  title: 'O relógio certo para a ocasião certa',
  description: 'Pronta-entrega e importação sob encomenda.',
  ctaLabel: 'Ver catálogo',
}
```

Enquanto não houver imagem configurada, o espaço aparece reservado com a marca,
sem quebrar o layout da página.

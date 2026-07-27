# Fotos dos produtos

Uma pasta, todas as fotos de relógio do catálogo. O que está aqui é servido na
raiz: `public/catalogo/rolex-datejust-41.jpg` vira `/catalogo/rolex-datejust-41.jpg`.

## Padrão das fotos

- **Quadrada (1:1)**, recomendado **1200 x 1200 px**. O card e a galeria da
  página de produto usam esse formato
- Fundo claro e uniforme, relógio centralizado com uma folga em volta
- Formato `.webp` (melhor) ou `.jpg`, até 250 KB por arquivo
- Nome do arquivo em minúsculas, sem acento, separado por hífen:
  `marca-modelo.webp` (ex.: `omega-speedmaster.webp`)
- Mais de uma foto do mesmo relógio: numere no fim (`omega-speedmaster-2.webp`)

## Como ligar a foto ao produto

Em `src/infra/catalog/watches.data.ts`, no relógio correspondente:

```ts
images: [
  {
    url: '/catalogo/omega-speedmaster.webp',
    alt: 'Omega Speedmaster Professional com mostrador preto',
  },
],
```

O `alt` é obrigatório: é o que o leitor de tela lê e o que o Google usa para
entender a imagem. Descreva a peça, não escreva "foto do relógio".

Se o arquivo não existir, o site mostra o marcador da marca no lugar, sem imagem
quebrada e sem deslocar o layout.

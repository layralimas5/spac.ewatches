# Site — Space Watches

E-commerce vitrine da Space Watches. Catálogo de relógios importados originais
e importação personalizada, com fechamento da venda pelo WhatsApp.

## Rodar

```bash
cd site
npm install
cp .env.example .env.local   # e preencher o número do WhatsApp
npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o sitemap e compila para `dist/` |
| `npm run typecheck` | TypeScript em modo strict |
| `npm run lint` | oxlint |
| `npm run preview` | Serve o build de produção localmente |

## Antes de publicar

1. **Trocar o catálogo de demonstração.** `src/infra/catalog/watches.data.ts`
   está com peças ILUSTRATIVAS — nomes, preços e referências inventados só para
   a interface ter o que mostrar. Nenhuma delas é estoque real.
2. **Colocar as fotos** em `public/catalogo/`, com o nome usado em `images.url`.
   Sem a foto, o card cai num marcador da marca em vez de quebrar.
3. **Preencher `VITE_WHATSAPP_NUMBER`** em `.env.local`. Sem ele, todo CTA cai
   no Instagram em vez do WhatsApp.
4. **Trocar o domínio** em `src/config/site.config.ts`, `public/robots.txt` e
   `scripts/generate-sitemap.ts` — hoje está `spacewatches.com.br`.

## Arquitetura

A regra é: **a UI nunca conhece a origem dos dados.**

```
src/
├── domain/       Tipos e regras do catálogo. Sem React, sem fetch.
│   ├── watch.ts              Entidade, filtros, ordenação
│   └── watch-repository.ts   Contrato de acesso
├── infra/        Implementação do contrato
│   └── catalog/  Hoje: arquivo local. Depois: Supabase.
├── application/  Hooks que ligam domínio à UI
├── config/       Configuração pública (WhatsApp, URLs)
├── lib/          Formatação, links, JSON-LD
└── ui/           Componentes, seções, páginas — só apresentação
```

Trocar o catálogo local pelo Supabase é **uma linha** em
`src/infra/catalog/index.ts`. Nenhuma página muda. O schema já está desenhado
em `../supabase/`.

## Decisões

**WhatsApp em vez de checkout.** A loja já vende por conversa, o ticket é alto e
a importação sob encomenda exige negociação de qualquer jeito. Cada CTA abre o
WhatsApp com o modelo e o preço já escritos, então o cliente não digita nada.
Se o número não estiver configurado, o link cai no Instagram — CTA morto é pior
que CTA alternativo.

**Filtros na URL.** `/catalogo?marca=Rolex&disponibilidade=pronta-entrega` é
compartilhável, sobrevive ao reload e faz o botão voltar funcionar.

**Escuro é a marca, não um tema.** Não existe modo claro. O logo nasce sobre
preto e o dourado é cor de detalhe — os tokens em `src/index.css` vêm de
`identidade/design-guide.md`, que é a fonte da verdade.

## Deploy

SPA: precisa de rewrite de todas as rotas para `index.html`, senão dar F5 em
`/catalogo` retorna 404. Já incluso para Netlify (`public/_redirects`) e Vercel
(`vercel.json`).

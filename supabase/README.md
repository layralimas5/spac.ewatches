# Banco — Space Watches

Base compartilhada entre o **site** (catálogo) e o **sistema** (estoque,
financeiro, CRM, ficha de clientes). Uma fonte de verdade só: o relógio que
aparece na vitrine é a mesma linha que baixa do estoque quando vende.

## Estado atual

> **Nada foi executado ainda.** Não existe projeto Supabase criado. A migration
> em `migrations/` foi escrita a partir do escopo combinado, mas **não foi
> rodada contra nenhum banco** — então não está validada. Trate como rascunho
> revisável, não como schema em produção.

## O que o schema cobre

| Frente | Tabelas |
| --- | --- |
| Catálogo / estoque | `brands`, `watches`, `watch_images` |
| Ficha de clientes | `customers`, `addresses` |
| CRM | `interactions`, `import_requests` |
| Vendas | `orders`, `order_items` |
| Financeiro | `payments`, `expenses` |
| Acesso | `staff` + RLS em tudo |

## Decisões que valem explicação

**Dinheiro em centavos (`bigint`).** Nunca `float` nem `money`. Um relógio de
R$ 89.900 vira `8990000`. O site já formata assim (`lib/format.ts`), então os
dois lados falam a mesma língua.

**Preço congelado em `order_items`.** O item guarda o preço praticado na venda.
Reajustar a tabela de preços depois não pode reescrever o histórico — senão o
relatório de margem do mês passado muda sozinho.

**`cost_cents` fora da vitrine.** A policy pública libera a linha de `watches`
publicada, e a linha inclui o custo de aquisição. Por isso existe a view
`public_watches`, sem custo: **o site lê da view, nunca da tabela**. Se alguém
apontar o site direto pra `watches`, o custo de cada peça vai no JSON.

**`slug` estável.** É o que vai na URL (`/relogio/<slug>`). Reciclar slug
quebra link indexado e link já mandado pra cliente no WhatsApp.

## Quando for ligar

1. Criar o projeto no Supabase
2. Rodar a migration (SQL Editor ou `supabase db push`)
3. Inserir a si mesma em `staff` com `role = 'dono'`
4. Criar o bucket de Storage para as fotos dos relógios
5. No site, trocar `LocalWatchRepository` por uma implementação Supabase — só a
   linha de `site/src/infra/catalog/index.ts` muda; nenhuma página é tocada

## O que ainda falta decidir

- **Fotos:** bucket público (mais simples, URL direta) ou privado com URL
  assinada. Público resolve para catálogo — foto de produto não é sigilo.
- **Reserva de peça:** hoje `status = 'reservado'` tira da vitrine, mas não há
  prazo de expiração. Se reserva sem sinal virar problema, entra um campo de
  validade.
- **Multi-usuário:** o schema já separa `dono` de `operador`, mas as policies
  hoje dão acesso igual aos dois. Se a operação crescer, restringir financeiro
  ao `dono`.

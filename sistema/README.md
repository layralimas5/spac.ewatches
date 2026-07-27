# Sistema de gestão da Space Watches

Aplicação separada do site: outro `package.json`, outro build, outro endereço.
O site vende, o sistema administra, e um não derruba o outro.

## Rodar

```bash
cd sistema
npm install
npm run dev      # http://localhost:5200
```

O site continua em `../site` na porta 5173. Os dois rodam ao mesmo tempo.

Outros comandos: `npm run typecheck`, `npm run lint`, `npm run build`.

## O que tem hoje

| Tela | O que resolve |
| --- | --- |
| **Painel** | Faturamento do mês contra o anterior, ticket médio, valor parado em estoque, resultado do caixa e a lista do que precisa de ação |
| **Estoque** | Peças com custo, preço, margem por unidade e ajuste rápido de quantidade |
| **Pedidos** | Funil do orçamento à entrega. Marcar como pago lança a venda no financeiro sozinho |
| **Clientes** | Ficha com contato, histórico de compra e o que a conversa ensinou. Botão para abrir o WhatsApp |
| **Entregas** | Prazo, transportadora e código de rastreio, com alerta de atraso. Avançar aqui atualiza o pedido |
| **Financeiro** | Entradas e saídas por mês, resultado, margem e para onde o dinheiro foi |

## Onde os dados moram

No `localStorage` do navegador, sob a chave `spacewatches.gestao.*`.

Isso é proposital para esta fase: dá para operar hoje, sem servidor e sem
custo. Duas consequências que precisam ficar claras:

- **Os dados são desse navegador.** Trocou de computador, não vê o mesmo.
- **Limpar os dados do site apaga tudo.**

Antes de usar para valer, ligue o Supabase. A troca mexe só em
`src/infra/stores.ts`: as telas conversam com a interface `Store`, nunca com o
`localStorage` direto. O formato já foi escolhido pensando nisso: `id` em uuid,
datas em ISO e dinheiro em centavos inteiros.

Os dados que aparecem na primeira abertura são de demonstração e não
representam estoque, cliente ou venda real.

## ⚠️ Antes de publicar

**O sistema não tem login.** Publicado como está, qualquer pessoa com o
endereço vê estoque, custo, margem, clientes e faturamento. Ele nasceu para
rodar na sua máquina.

Publicar com segurança exige, na ordem:

1. Supabase com autenticação (e-mail e senha basta para uma operação de uma pessoa)
2. Row Level Security nas tabelas, para o acesso ser por linha e não por confiança
3. Só então o deploy no Netlify, como site separado do da loja

## Deploy (quando houver login)

Site novo no Netlify, apontando para o mesmo repositório, com **base
directory** em `sistema`. O `netlify.toml` daqui cuida do resto: build,
publicação, `noindex` e cabeçalhos de segurança.

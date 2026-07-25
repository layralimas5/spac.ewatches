# MazyOS — Sistema operacional do negócio

Sua empresa roda em cima desse arquivo. Aqui ficam as regras de operação
do MazyOS — como o Claude lê o contexto, aprende com correções, mantém
tudo atualizado e cria skills novas conforme a operação evolui.

Esse arquivo é editável. Quando o `/instalar` rodar, ele complementa o
final dessa página com as regras específicas do seu negócio.

> **Instalado em 25/07/2026** para o projeto **Space Watches** — perfil
> solopreneur / criador solo. As regras do negócio estão no fim do arquivo.

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (quando existirem
e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_memoria/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos

Usar essas informações como base pra qualquer resposta ou decisão. Ao
sugerir prioridades, formatos ou abordagens, considerar o foco atual
descrito em `estrategia.md`.

Pra qualquer tarefa visual (carrossel, post, landing page), consultar
`identidade/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas
usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante
em `.claude/skills/`. Se encontrar, seguir as instruções da skill. Se
não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o
usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o
padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma
instrução que parece permanente (frases como "na verdade é assim", "não
faça mais isso", "prefiro assim", "sempre que...", "evita...", "da
próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (clientes, serviços, mercado) → `_memoria/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato, o que evitar) → `_memoria/preferencias.md`
- **Sobre prioridades e foco** (projetos, metas, prazos) → `_memoria/estrategia.md`
- **Regra de comportamento nessa pasta** → próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro.
Confirmar mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na
verdade o arquivo se chama X"). Só perguntar quando a informação tiver
valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante (cliente novo, skill
nova, mudança de foco, processo novo, ferramenta instalada, estrutura
alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize a memória?"

Se sim, identificar o que atualizar:

- **Cliente, serviço, ferramenta, equipe** → `_memoria/empresa.md`
- **Mudança de prioridade ou foco** → `_memoria/estrategia.md`
- **Tom ou estilo** → `_memoria/preferencias.md`
- **Pasta, regra de organização, skill criada** → `CLAUDE.md`
- **Visual (cores, fontes, logo)** → `identidade/design-guide.md`

Mostrar o que vai mudar antes de salvar. Não reformatar o arquivo
inteiro, só adicionar ou editar a linha relevante.

**Quando NÃO perguntar:**
- Tarefas pontuais sem impacto no contexto (escrever um email avulso, criar um post)
- Perguntas simples ou conversas sem ação
- Mudanças já salvas pelo bloco "Aprender com correções"

**Dica:** rode `/atualizar` pra uma varredura completa quando houver dúvida.

---

## Criação de skills

Quando o usuário pedir skill nova:

1. Verificar se existe template relevante em `templates/skills/`. Se
   existir, usar como base e adaptar pro contexto
2. Perguntar se é específica desse projeto ou útil em qualquer:
   - Específica → `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Universal → `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_memoria/empresa.md` e `_memoria/preferencias.md` pra calibrar
   o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, exemplos),
   criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code

---
---

# Space Watches — regras do negócio

> Perfil: **solopreneur / criador solo**. Uma marca, uma operação.

## O que é esse workspace

Operação da **Space Watches** — loja de relógios originais e importação
personalizada. Aqui se produz o conteúdo, se planeja a conversão e se
constrói o site e o sistema de gestão da loja.

**Estrutura de pastas:**
- `_memoria/` — quem é a marca, como ela fala, o que tá em foco
- `identidade/` — cores, fontes, logo, padrão visual (`design-guide.md`, `logo.png`)
- `marketing/` — conteúdo, SEO, campanhas (saída das skills)
- `saidas/` — análises, emails, documentos pontuais
- `dados/` — arquivos a analisar (CSV, PDF, planilha)
- `scripts/` — utilitários (gerar imagem, render)
- `templates/` — moldes usados pelas skills

## Quem é a marca

Space Watches vende relógio importado original e faz importação sob
encomenda. Produto chique, comprador que valoriza originalidade e marca.
O diferencial é conseguir o modelo que a pessoa quer, importado, sendo
original de verdade — num mercado onde réplica é regra.

Quem opera esse workspace é a **Layra Lima**, web designer e
desenvolvedora contratada pelo projeto. Ela é prestadora, não dona: todo
material público sai **assinado pela Space Watches**, nunca pela Layra.

## O que se produz aqui

- Conteúdo de Instagram (post e carrossel de produto — canal de venda atual)
- Site e-commerce responsivo e de alta conversão *(em construção — prioridade 1)*
- Sistema de gestão: estoque, financeiro, CRM, ficha de clientes *(depois do site)*

## Tom de voz

Direto e natural, escrito igual se fala, explicando pelo resultado
concreto. Para o público da marca, subir o acabamento sem virar pompa:
elegante-direto, deixando produto e preço falarem.

Evitar: **gíria** (ranço declarado), informalidade forçada e texto
empolado tentando soar luxuoso.

## Regras do sistema

- Qualquer tarefa visual lê `identidade/design-guide.md` antes — a marca é
  **preto profundo + dourado**, dourado só em detalhe e CTA.
- Escrever sempre **"Space Watches"**. `spac.ewatches` é só o handle do
  Instagram e não entra em material visual.
- Nada de selo de promoção, urgência estridente ou badge vermelho — mata o
  posicionamento premium.
- Conteúdo novo salvar em `marketing/conteudo/<tipo>-<tema>-<data>/`
- Ao modelar dados do site (catálogo, estoque), lembrar que o sistema de
  gestão virá depois e deve compartilhar a mesma base.

## Ferramentas conectadas

- [x] Instagram (@spac.ewatches — canal de venda atual, sem MCP)
- [ ] Notion
- [ ] Canva
- [ ] Google Calendar
- [ ] Meta Ads
- [ ] Google Ads

*(Marcar conforme for instalando os MCPs)*

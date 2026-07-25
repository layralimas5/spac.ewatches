-- =============================================================================
-- Space Watches — schema inicial
--
-- ⚠️ MIGRATION AINDA NÃO EXECUTADA. Escrita antes de existir projeto Supabase,
--    portanto NÃO foi rodada nem validada contra um banco real. Revisar e
--    aplicar em ambiente de desenvolvimento antes de qualquer coisa séria.
--
-- Cobre as quatro frentes pedidas — estoque, financeiro, CRM e ficha de
-- clientes — e serve o catálogo do site a partir das MESMAS tabelas. Essa é a
-- razão de o schema nascer junto com o site: o relógio que aparece no catálogo
-- e o relógio que baixa do estoque quando vende são a mesma linha.
--
-- Convenções:
--   · Dinheiro sempre em CENTAVOS (bigint). Nunca float para valor.
--   · Toda tabela com RLS ligado. Leitura pública só do que é vitrine.
--   · `updated_at` mantido por trigger, não por confiança na aplicação.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Infra comum
-- -----------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Quem é a equipe. Toda escrita no sistema exige estar aqui dentro.
create table staff (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null default 'operador' check (role in ('dono', 'operador')),
  created_at timestamptz not null default now()
);

create or replace function is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from staff where id = auth.uid());
$$;

-- -----------------------------------------------------------------------------
-- Catálogo e estoque
-- -----------------------------------------------------------------------------

create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table watches (
  id uuid primary key default gen_random_uuid(),
  -- Slug é o que vai na URL do site (/relogio/<slug>). Estável, nunca reciclar.
  slug text not null unique,
  brand_id uuid not null references brands (id) on delete restrict,
  name text not null,
  reference text,

  condition text not null check (condition in ('novo', 'seminovo')),
  availability text not null check (availability in ('pronta-entrega', 'sob-encomenda')),

  -- Estoque. `reservado` sai da vitrine sem virar venda ainda.
  status text not null default 'rascunho'
    check (status in ('rascunho', 'publicado', 'reservado', 'vendido', 'arquivado')),

  price_cents bigint not null check (price_cents > 0),
  previous_price_cents bigint check (previous_price_cents > price_cents),
  -- Custo de aquisição: base da margem nos relatórios. NUNCA exposto ao público.
  cost_cents bigint check (cost_cents >= 0),

  short_description text not null,
  description text not null default '',

  specs jsonb not null default '{}'::jsonb,

  has_box_and_papers boolean not null default false,
  warranty_months integer not null default 0 check (warranty_months >= 0),
  featured boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index watches_status_idx on watches (status);
create index watches_brand_idx on watches (brand_id);
-- Vitrine ordenada por preço é a consulta mais frequente do site.
create index watches_showcase_idx on watches (status, featured desc, price_cents);

create trigger watches_set_updated_at
  before update on watches
  for each row execute function set_updated_at();

create table watch_images (
  id uuid primary key default gen_random_uuid(),
  watch_id uuid not null references watches (id) on delete cascade,
  storage_path text not null,
  alt text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index watch_images_watch_idx on watch_images (watch_id, position);

-- -----------------------------------------------------------------------------
-- Clientes (ficha) e CRM
-- -----------------------------------------------------------------------------

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  document text,
  birth_date date,
  notes text,
  -- Preferências (marcas, faixa de preço, modelos procurados) para reativar depois.
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_phone_idx on customers (phone);
create index customers_email_idx on customers (email);

create trigger customers_set_updated_at
  before update on customers
  for each row execute function set_updated_at();

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  label text not null default 'principal',
  street text not null,
  number text,
  complement text,
  district text,
  city text not null,
  state text not null,
  postal_code text not null,
  created_at timestamptz not null default now()
);

-- Histórico de contato: o que sustenta o follow-up e evita repetir conversa.
create table interactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  channel text not null check (channel in ('whatsapp', 'instagram', 'presencial', 'email', 'telefone')),
  summary text not null,
  happened_at timestamptz not null default now(),
  created_by uuid references staff (id) on delete set null,
  created_at timestamptz not null default now()
);

create index interactions_customer_idx on interactions (customer_id, happened_at desc);

-- Funil da importação personalizada — a segunda oferta da loja.
create table import_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers (id) on delete set null,
  requested_model text not null,
  reference text,
  notes text,
  status text not null default 'novo'
    check (status in ('novo', 'cotando', 'cotado', 'aprovado', 'em-transito', 'entregue', 'perdido')),
  quoted_price_cents bigint check (quoted_price_cents > 0),
  estimated_days integer check (estimated_days >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index import_requests_status_idx on import_requests (status, created_at desc);

create trigger import_requests_set_updated_at
  before update on import_requests
  for each row execute function set_updated_at();

-- -----------------------------------------------------------------------------
-- Vendas
-- -----------------------------------------------------------------------------

create table orders (
  id uuid primary key default gen_random_uuid(),
  -- Número curto e legível para citar no atendimento.
  code text not null unique,
  customer_id uuid not null references customers (id) on delete restrict,
  status text not null default 'aberto'
    check (status in ('aberto', 'pago', 'enviado', 'entregue', 'cancelado')),
  channel text not null default 'whatsapp'
    check (channel in ('whatsapp', 'instagram', 'presencial', 'site')),
  total_cents bigint not null default 0 check (total_cents >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_customer_idx on orders (customer_id, created_at desc);
create index orders_status_idx on orders (status);

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  watch_id uuid not null references watches (id) on delete restrict,
  -- Preço congelado no momento da venda: mudar a tabela depois não reescreve o histórico.
  unit_price_cents bigint not null check (unit_price_cents > 0),
  cost_cents bigint check (cost_cents >= 0),
  created_at timestamptz not null default now(),
  -- Cada peça é única: o mesmo relógio não pode ser vendido duas vezes no mesmo pedido.
  unique (order_id, watch_id)
);

-- -----------------------------------------------------------------------------
-- Financeiro
-- -----------------------------------------------------------------------------

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  amount_cents bigint not null check (amount_cents > 0),
  method text not null check (method in ('pix', 'cartao', 'dinheiro', 'transferencia', 'outro')),
  paid_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index payments_order_idx on payments (order_id);
create index payments_paid_at_idx on payments (paid_at desc);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text not null check (category in ('aquisicao', 'importacao', 'frete', 'imposto', 'marketing', 'operacional', 'outro')),
  amount_cents bigint not null check (amount_cents > 0),
  -- Amarra a despesa à peça quando for custo direto — é o que fecha a margem real.
  watch_id uuid references watches (id) on delete set null,
  spent_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index expenses_spent_at_idx on expenses (spent_at desc);
create index expenses_category_idx on expenses (category);

-- -----------------------------------------------------------------------------
-- Row Level Security
--
-- Regra geral: o público lê só a vitrine; todo o resto exige estar em `staff`.
-- Cliente, financeiro e custo NUNCA são legíveis sem autenticação.
-- -----------------------------------------------------------------------------

alter table staff            enable row level security;
alter table brands           enable row level security;
alter table watches          enable row level security;
alter table watch_images     enable row level security;
alter table customers        enable row level security;
alter table addresses        enable row level security;
alter table interactions     enable row level security;
alter table import_requests  enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table payments         enable row level security;
alter table expenses         enable row level security;

-- Equipe: cada um enxerga o próprio registro; o dono enxerga todos.
create policy staff_self_read on staff
  for select using (id = auth.uid() or exists (
    select 1 from staff s where s.id = auth.uid() and s.role = 'dono'
  ));

-- Vitrine pública: só relógios publicados.
create policy watches_public_read on watches
  for select to anon using (status = 'publicado');

create policy watch_images_public_read on watch_images
  for select to anon using (exists (
    select 1 from watches w where w.id = watch_id and w.status = 'publicado'
  ));

create policy brands_public_read on brands
  for select to anon using (true);

-- ATENÇÃO: `watches` publicado é legível pelo anon, e isso inclui `cost_cents`.
-- O site NÃO deve consultar a tabela direto — deve ler de uma view sem custo.
-- Ver `public_watches` abaixo.

-- Acesso total da equipe a tudo.
do $$
declare
  t text;
begin
  foreach t in array array[
    'brands', 'watches', 'watch_images', 'customers', 'addresses',
    'interactions', 'import_requests', 'orders', 'order_items',
    'payments', 'expenses'
  ]
  loop
    execute format(
      'create policy %I_staff_all on %I for all to authenticated using (is_staff()) with check (is_staff());',
      t, t
    );
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- View pública do catálogo
--
-- É daqui que o site lê. Existe para o custo de aquisição não vazar junto com
-- o preço — a policy acima libera a linha inteira, e `cost_cents` não pode sair.
-- -----------------------------------------------------------------------------

create view public_watches
with (security_invoker = true)
as
select
  w.id,
  w.slug,
  b.name as brand,
  w.name,
  w.reference,
  w.condition,
  w.availability,
  w.price_cents,
  w.previous_price_cents,
  w.short_description,
  w.description,
  w.specs,
  w.has_box_and_papers,
  w.warranty_months,
  w.featured
from watches w
join brands b on b.id = w.brand_id
where w.status = 'publicado';

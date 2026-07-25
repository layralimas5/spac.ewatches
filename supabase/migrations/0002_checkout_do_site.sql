-- =============================================================================
-- Space Watches — o que o checkout do site precisa
--
-- ⚠️ NÃO EXECUTADA. Assim como a 0001, foi escrita sem projeto Supabase
--    existente, então não foi validada contra um Postgres real.
--
-- A 0001 modelou a operação interna (estoque, CRM, financeiro). Esta abre o
-- caminho do site: pedido nascido no checkout, com reserva de estoque e
-- endereço de entrega do próprio pedido.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Estoque e SKU no catálogo
-- -----------------------------------------------------------------------------

alter table watches
  add column if not exists sku text,
  add column if not exists stock integer not null default 0 check (stock >= 0);

-- SKU é como a equipe chama a peça no dia a dia; não pode repetir.
create unique index if not exists watches_sku_idx on watches (sku) where sku is not null;

-- -----------------------------------------------------------------------------
-- Pedido vindo do site
-- -----------------------------------------------------------------------------

alter table orders
  add column if not exists source text not null default 'manual'
    check (source in ('manual', 'site')),
  add column if not exists subtotal_cents bigint not null default 0 check (subtotal_cents >= 0),
  add column if not exists shipping_cents bigint not null default 0 check (shipping_cents >= 0),
  add column if not exists discount_cents bigint not null default 0 check (discount_cents >= 0),
  add column if not exists payment_method text
    check (payment_method in ('pix', 'cartao', 'dinheiro', 'transferencia', 'outro')),
  add column if not exists shipping_label text,
  add column if not exists shipping_estimated_days integer check (shipping_estimated_days >= 0);

-- Canal 'site' entra no CHECK de `channel` criado na 0001.
alter table orders drop constraint if exists orders_channel_check;
alter table orders add constraint orders_channel_check
  check (channel in ('whatsapp', 'instagram', 'presencial', 'site'));

/*
 * Endereço de entrega copiado para dentro do pedido.
 *
 * Não é referência a `addresses`: se o cliente mudar de endereço depois, o
 * pedido antigo tem que continuar mostrando para onde foi entregue de fato.
 */
create table if not exists order_shipping_addresses (
  order_id uuid primary key references orders (id) on delete cascade,
  recipient_name text not null,
  document text not null,
  phone text not null,
  email text not null,
  postal_code text not null,
  street text not null,
  number text not null,
  complement text,
  district text not null,
  city text not null,
  state text not null check (char_length(state) = 2),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Reserva de estoque
--
-- O problema real: duas pessoas abrem a mesma peça única e fecham o pedido no
-- mesmo minuto. Sem reserva, a loja vende duas vezes o que só existe uma.
-- -----------------------------------------------------------------------------

create table if not exists stock_reservations (
  id uuid primary key default gen_random_uuid(),
  watch_id uuid not null references watches (id) on delete cascade,
  order_id uuid references orders (id) on delete cascade,
  quantity integer not null check (quantity > 0),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists stock_reservations_watch_idx on stock_reservations (watch_id, expires_at);

/*
 * Estoque realmente disponível = estoque físico menos reservas ainda válidas.
 * É esta função que o site deve consultar, nunca `watches.stock` cru.
 */
create or replace function available_stock(target_watch_id uuid)
returns integer
language sql
stable
set search_path = public
as $$
  select greatest(
    0,
    coalesce((select stock from watches where id = target_watch_id), 0)
      - coalesce((
          select sum(quantity)
          from stock_reservations
          where watch_id = target_watch_id and expires_at > now()
        ), 0)
  );
$$;

-- -----------------------------------------------------------------------------
-- RLS
--
-- O site é anônimo: ele PODE criar pedido, mas não pode ler pedido nenhum.
-- Sem isso, qualquer visitante lista os pedidos (e os dados pessoais) de todos.
-- -----------------------------------------------------------------------------

alter table order_shipping_addresses enable row level security;
alter table stock_reservations       enable row level security;

create policy order_shipping_addresses_staff_all on order_shipping_addresses
  for all to authenticated using (is_staff()) with check (is_staff());

create policy stock_reservations_staff_all on stock_reservations
  for all to authenticated using (is_staff()) with check (is_staff());

/*
 * Criação de pedido pelo visitante.
 *
 * `with check` sem `using`: permite INSERT e não permite SELECT. O site recebe
 * de volta apenas o código do pedido, que ele mesmo gerou — nunca a tabela.
 *
 * Em produção, o caminho mais seguro é uma Edge Function com service role
 * fazendo a validação de preço no servidor. Preço que vem do navegador não é
 * confiável: o cliente pode alterá-lo antes de enviar.
 */
create policy orders_anon_insert on orders
  for insert to anon with check (source = 'site' and status = 'aberto');

create policy order_items_anon_insert on order_items
  for insert to anon with check (true);

create policy order_shipping_addresses_anon_insert on order_shipping_addresses
  for insert to anon with check (true);

-- Vitrine precisa enxergar o estoque disponível.
grant execute on function available_stock(uuid) to anon;

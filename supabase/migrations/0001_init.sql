-- Brew Pass core schema. Phase 1: menu, orders, KHQR payments, points, promotions, auth identities.

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  opens_hour int not null default 7,
  closes_hour int not null default 19,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  detail text,
  price_khr int not null check (price_khr >= 0),
  promo_price_khr int check (promo_price_khr >= 0),
  active boolean not null default true
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text,
  item_id text references public.menu_items(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  check (ends_at > starts_at)
);

create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- One row per sign-in method. Lets a customer link and recover with any verified method.
create table if not exists public.auth_identities (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  provider text not null check (provider in ('phone_sms', 'phone_telegram', 'phone_whatsapp', 'google', 'apple')),
  provider_user_id text not null,
  verified_at timestamptz not null default now(),
  unique (provider, provider_user_id)
);

create type public.order_status as enum (
  'pending_payment', 'paid', 'preparing', 'ready', 'picked_up', 'expired', 'cancelled'
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  store_id uuid references public.stores(id),
  status public.order_status not null default 'pending_payment',
  pickup_at timestamptz,
  items jsonb not null,
  total_khr int not null check (total_khr >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'bakong_khqr',
  provider_ref text unique,
  amount_khr int not null,
  status text not null default 'created' check (status in ('created', 'paid', 'failed', 'expired')),
  paid_at timestamptz
);

-- Points: append-only ledger. Balance = sum(points). Earn rule is configuration.
create table if not exists public.earn_rule (
  id int primary key default 1 check (id = 1),
  points_per_unit int not null default 1,
  unit_khr int not null default 4000,
  updated_at timestamptz not null default now()
);
insert into public.earn_rule (id) values (1) on conflict do nothing;

create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  points int not null,
  reason text not null default 'purchase',
  created_at timestamptz not null default now(),
  unique (order_id, reason)
);

-- Row-level security: customers see only their own rows. Staff use the service role.
alter table public.customers enable row level security;
alter table public.auth_identities enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.points_ledger enable row level security;
alter table public.stores enable row level security;
alter table public.menu_items enable row level security;
alter table public.promotions enable row level security;
alter table public.earn_rule enable row level security;

create policy "customer reads own profile" on public.customers
  for select using (auth.uid() = id);
create policy "customer updates own profile" on public.customers
  for update using (auth.uid() = id);

create policy "customer reads own identities" on public.auth_identities
  for select using (auth.uid() = customer_id);

create policy "customer reads own orders" on public.orders
  for select using (auth.uid() = customer_id);
create policy "customer creates own orders" on public.orders
  for insert with check (auth.uid() = customer_id and status = 'pending_payment');

create policy "customer reads own payments" on public.payments
  for select using (exists (
    select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()
  ));

create policy "customer reads own points" on public.points_ledger
  for select using (auth.uid() = customer_id);

-- Public catalogue: anyone may read stores, active menu and live promotions.
create policy "public reads stores" on public.stores for select using (true);
create policy "public reads active menu" on public.menu_items for select using (active);
create policy "public reads live promotions" on public.promotions
  for select using (now() between starts_at and ends_at);
create policy "public reads earn rule" on public.earn_rule for select using (true);

-- Customers cannot change status, payments or points directly. Only the
-- khqr-webhook and staff functions (service role) write those.
-- Status changes that are allowed:  pending_payment -> cancelled by the customer
-- is handled by a function, not by a client update policy.

-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create inventory table
create table inventory (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null check (category in ('Custom Hair Blends', 'Tools', 'Faux Locs Hair', 'Braiding Hair')),
  brand text,
  qty integer not null default 0,
  price numeric(10,2) not null default 0,
  status text not null default 'In Stock' check (status in ('In Stock', 'Low Stock', 'No Stock')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table inventory enable row level security;

-- 3. Policy: only authenticated users can do anything
create policy "Authenticated users can read inventory"
  on inventory for select
  to authenticated
  using (true);

create policy "Authenticated users can insert inventory"
  on inventory for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update inventory"
  on inventory for update
  to authenticated
  using (true);

create policy "Authenticated users can delete inventory"
  on inventory for delete
  to authenticated
  using (true);

-- 4. Create an index for faster category filtering
create index idx_inventory_category on inventory(category);

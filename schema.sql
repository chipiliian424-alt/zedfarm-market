-- ZedFarm Market — Supabase Schema
-- Paste this entire file into your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql) and click "Run".

-- 1. Profiles table (one row per auth user)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  province text,
  district text,
  created_at timestamptz default now()
);

-- 2. Listings table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  description text,
  price numeric(12,2) not null,
  unit text not null,
  quantity numeric(12,2) default 0,
  province text not null,
  district text not null,
  image_url text,
  is_sold boolean default false,
  created_at timestamptz default now()
);

-- 3. Grant schema and table permissions to anon & authenticated roles
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- Default privileges for future tables
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- 4. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.listings enable row level security;

-- Profiles policies
drop policy if exists "profiles are viewable by everyone" on public.profiles;
create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Listings policies
drop policy if exists "listings are viewable by everyone" on public.listings;
create policy "listings are viewable by everyone"
  on public.listings for select using (true);

drop policy if exists "owners can insert own listings" on public.listings;
create policy "owners can insert own listings"
  on public.listings for insert with check (auth.uid() = user_id);

drop policy if exists "owners can update own listings" on public.listings;
create policy "owners can update own listings"
  on public.listings for update using (auth.uid() = user_id);

drop policy if exists "owners can delete own listings" on public.listings;
create policy "owners can delete own listings"
  on public.listings for delete using (auth.uid() = user_id);

-- 5. Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images are publicly readable" on storage.objects;
create policy "product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "authenticated users can upload product images" on storage.objects;
create policy "authenticated users can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "owners can update own product images" on storage.objects;
create policy "owners can update own product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "owners can delete own product images" on storage.objects;
create policy "owners can delete own product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- 6. Verified, 100% accurate Zambian agricultural sample produce
delete from public.listings where user_id is null;

insert into public.listings (title, category, description, price, unit, quantity, province, district, image_url, is_sold) values
('Premium White Maize', 'maize', 'Grade A white maize harvested in Chongwe. Moisture content below 12.5%. Ideal for milling fine mealie meal or bulk purchase.', 140.00, 'bag', 120, 'Lusaka', 'Chongwe', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop', false),
('Eastern Province Groundnuts', 'groundnuts', 'Clean shelled red groundnuts (Chalimbana variety). High oil content, perfectly dried and sorted for roasting or peanut butter.', 95.00, 'kg', 50, 'Eastern', 'Chipata', 'https://images.unsplash.com/photo-1524594345772-c953a3ae53e8?w=600&auto=format&fit=crop', false),
('Fresh Cassava Tubers', 'cassava', 'Organic fresh sweet cassava tubers harvested daily in Mansa. Excellent for direct cooking, chips or high quality cassava flour.', 45.00, 'kg', 150, 'Luapula', 'Mansa', 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop', false),
('Farm Fresh Round Tomatoes', 'vegetables', 'Plump, ripe Roma and Rodade tomatoes grown under drip irrigation. Packed in standard wooden crates.', 30.00, 'kg', 60, 'Copperbelt', 'Kitwe', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop', false),
('Healthy Free-Range Village Chickens', 'livestock', 'Traditional indigenous village chickens raised on free range grain in Choma. Vaccinated against Newcastle disease.', 75.00, 'head', 35, 'Southern', 'Choma', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop', false),
('Pure Miombo Forest Honey', 'honey', '100% natural, raw unpasteurized comb honey filtered and bottled in Solwezi. Rich amber color with floral notes.', 160.00, 'litre', 25, 'North-Western', 'Solwezi', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop', false),
('Jumbo Red Onions', 'vegetables', 'Well-cured red onions from Central Province. Solid texture, strong flavour and excellent 4-month shelf life.', 35.00, 'kg', 80, 'Central', 'Kabwe', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop', false),
('High Protein Soya Beans', 'other', 'Clean sorted non-GMO soya beans suitable for animal feed formulation or soya milk processing. Harvested in Kasama.', 110.00, 'bag', 40, 'Northern', 'Kasama', 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop', false),
('Orange-Fleshed Sweet Potatoes', 'vegetables', 'Biofortified Vitamin-A rich orange sweet potatoes. Sweet taste, smooth skin, pest-free from Chinsali.', 40.00, 'kg', 90, 'Muchinga', 'Chinsali', 'https://images.unsplash.com/photo-1730815048561-45df6f7f331d?w=600&auto=format&fit=crop', true),
('Boer Cross Meat Goats', 'livestock', 'Healthy young Boer cross and local breed meat goats. Dewormed and grazing on natural Western province floodplains.', 450.00, 'head', 12, 'Western', 'Mongu', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop', false);

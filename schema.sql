-- Catégories produits
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
    CREATE TYPE public.product_category AS ENUM ('parfum', 'huile', 'deodorant', 'brume');
  END IF;
END $$;

ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'brume';

-- Table principale des produits
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  whatsapp text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  image_url text,
  category public.product_category NOT NULL,
  stock integer DEFAULT 0,
  seller_name text NOT NULL DEFAULT 'Essence Suprême',
  seller_whatsapp text NOT NULL DEFAULT '212600000000',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text,
  customer_phone text,
  customer_address text,
  items jsonb NOT NULL,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.catalog_import_exclusions (
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (admin_id, product_name)
);

-- Migration si la table existait déjà
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS compare_at_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS seller_name text NOT NULL DEFAULT 'Essence Suprême',
  ADD COLUMN IF NOT EXISTS seller_whatsapp text NOT NULL DEFAULT '212600000000',
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Sécurité Row Level Security (RLS)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_import_exclusions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can manage own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage own catalog exclusions" ON public.catalog_import_exclusions;

CREATE POLICY "Admins can view own profile" ON public.admin_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage own profile" ON public.admin_profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Les visiteurs peuvent lire les produits
CREATE POLICY "Public can view products" ON public.products
  FOR SELECT
  USING (true);

-- Chaque admin peut créer, modifier et supprimer seulement ses propres produits
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL
  USING (auth.uid() = admin_id)
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage own orders" ON public.orders
  FOR ALL
  USING (auth.uid() = admin_id)
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can manage own catalog exclusions" ON public.catalog_import_exclusions
  FOR ALL
  USING (auth.uid() = admin_id)
  WITH CHECK (auth.uid() = admin_id);

-- Bucket public pour les images produits
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Image access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Image management" ON storage.objects;

CREATE POLICY "Public Image access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin Image management" ON storage.objects
  FOR ALL
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ReviewPilot Database Schema
-- Run this in your Supabase SQL editor

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  google_place_id text,
  twilio_phone text,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'trialing',
  trial_ends_at timestamptz default (now() + interval '14 days'),
  created_at timestamptz default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  phone text,
  email text,
  created_at timestamptz default now()
);

create table if not exists review_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete cascade not null,
  token text unique default encode(gen_random_bytes(16), 'hex'),
  channel text not null check (channel in ('sms', 'email', 'both')),
  sent_at timestamptz default now(),
  clicked_at timestamptz,
  status text default 'sent' check (status in ('sent', 'clicked', 'reviewed')),
  sms_sid text,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table businesses enable row level security;
alter table customers enable row level security;
alter table review_requests enable row level security;

-- Businesses: users can only access their own business
create policy "Users own their business"
  on businesses for all
  using (auth.uid() = user_id);

-- Customers: only accessible through owned business
create policy "Business owns customers"
  on customers for all
  using (
    business_id in (
      select id from businesses where user_id = auth.uid()
    )
  );

-- Review requests: only accessible through owned business
create policy "Business owns requests"
  on review_requests for all
  using (
    business_id in (
      select id from businesses where user_id = auth.uid()
    )
  );

-- Public read for review token lookup (customers clicking links)
create policy "Public token lookup"
  on review_requests for select
  using (true);

create policy "Public business lookup"
  on businesses for select
  using (true);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_businesses_user_id on businesses(user_id);
create index if not exists idx_customers_business_id on customers(business_id);
create index if not exists idx_review_requests_business_id on review_requests(business_id);
create index if not exists idx_review_requests_token on review_requests(token);
create index if not exists idx_review_requests_customer_id on review_requests(customer_id);

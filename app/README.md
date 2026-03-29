# ReviewPilot

> Send automated Google review requests via SMS + email. Built for local service businesses.

$29/month · 14-day free trial · No ops

---

## Tech Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — auth + database + RLS
- **Twilio** — SMS delivery
- **SendGrid** — email delivery
- **Stripe** — subscriptions ($29/month)
- **Vercel** — hosting

---

## Setup

### 1. Clone & install

```bash
cd review-pilot-app
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role (server-side only)
- `TWILIO_ACCOUNT_SID` — From Twilio Console
- `TWILIO_AUTH_TOKEN` — From Twilio Console
- `TWILIO_PHONE_NUMBER` — Your Twilio phone number (E.164 format)
- `SENDGRID_API_KEY` — SendGrid API key
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — From `stripe listen` or Stripe Dashboard
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_PRICE_ID` — Your $29/month price ID in Stripe
- `NEXT_PUBLIC_APP_URL` — Your production URL (or http://localhost:3000 for dev)

### 3. Supabase setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Copy your project URL and keys to `.env.local`
4. Enable **Email** auth provider in Authentication → Providers

### 4. Stripe setup

1. Create a product in Stripe Dashboard: "ReviewPilot Pro" at $29/month
2. Copy the **Price ID** (starts with `price_`) to `STRIPE_PRICE_ID`
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### 5. Twilio setup

1. Create a Twilio account at [twilio.com](https://twilio.com)
2. Buy a phone number
3. Copy Account SID, Auth Token, and phone number to `.env.local`

### 6. SendGrid setup

1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Create an API key with "Mail Send" permission
3. Verify your sender domain (or email address for testing)
4. Set `SENDGRID_FROM_EMAIL` to your verified sender

### 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How it works

1. Business signs up → 14-day free trial
2. Business adds customers (name, phone, email)
3. Business clicks "Send Review Request" → chooses SMS / Email / Both
4. Customer receives message with link to `https://reviewpilot.app/review/{token}`
5. Customer taps link → click is recorded → redirected to Google review page
6. Business sees stats: sent, clicked, estimated reviews

---

## Google Place ID

To send customers directly to your Google review page:
1. Go to [Google Maps Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business
3. Copy the Place ID (starts with `ChIJ...`)
4. Paste it in Settings → Google Place ID

---

## Deployment (Vercel)

```bash
npx vercel
```

Set all environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

---

## File Structure

```
app/
  (auth)/           # Login + Signup pages
  (dashboard)/      # Protected dashboard routes
    dashboard/      # Stats + recent requests
    customers/      # Customer list
    settings/       # Business profile + billing
  api/
    send-request/   # POST: send SMS/email review request
    reviews/        # GET/PATCH: review request data
    checkout/       # GET: redirect to Stripe checkout
    billing-portal/ # POST: open Stripe billing portal
    webhooks/stripe # POST: handle Stripe events
  review/[token]/   # Public: customer landing page → Google review

lib/
  supabase.ts       # DB client + types
  twilio.ts         # SMS sending
  sendgrid.ts       # Email sending
  stripe.ts         # Checkout + billing portal
  google-business.ts # Review URL builder

components/
  ui/               # Sidebar, Modal
  dashboard/        # StatsBar, RecentRequests, SendRequestModal, DashboardPageUI
  customers/        # CustomerTable, CustomersPageUI
```

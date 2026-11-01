# RONVERO — Premium Activewear E-Commerce Platform

A full-stack MERN e-commerce platform for an original performance-activewear
brand, inspired by the layout/UX/animation patterns of premium activewear
retailers (no branding, copy, imagery, or product data copied from any
reference site — everything here is original to RONVERO).

```
ronvero-ecommerce/
├── backend/     Node + Express + MongoDB API
└── frontend/    React + Vite + Tailwind storefront
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI at minimum — see below
npm run seed              # populates categories, products, banners, etc.
npm run dev                # http://localhost:5000
```

`.env` values that matter to get running locally:

| Variable | Required to boot? | Notes |
|---|---|---|
| `MONGO_URI` | **Yes** | Local Mongo or an Atlas connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | **Yes** | Any long random strings |
| `CLIENT_URL` | Yes | Defaults to `http://localhost:5173` |
| `CLOUDINARY_*` | No | Only needed for the admin image-upload endpoint |
| `STRIPE_SECRET_KEY` | No | Without it, card checkout is disabled and the storefront falls back to Cash on Delivery |
| `SMTP_*` | No | Without it, emails (verification, password reset, order confirmation, contact form) are logged to the console instead of sent |

Seeded demo admin login (created by `npm run seed`):
`admin` / `admin`

This is intentionally a sample-only credential. Change it before giving public access to a client or deploying the site.

To create or reset this admin without deleting existing catalog data, run `npm run seed:admin` from `backend/`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # optional — only needed for card checkout, see below
npm run dev                 # http://localhost:5173
```

`VITE_STRIPE_PUBLISHABLE_KEY` in the frontend `.env` is optional — leave it
blank and checkout will only offer Cash on Delivery. Add it (with a matching
`STRIPE_SECRET_KEY` in the backend) to enable card payments via Stripe
Elements.

The Vite dev server proxies `/api/*` to `http://localhost:5000`, so run the
backend first (or alongside).

## Deploying the storefront

The repository includes a `netlify.toml` for Netlify's React single-page app
build. Connect the GitHub repository to Netlify; it will build from `frontend/`
with `npm run build` and publish `frontend/dist`. Set `VITE_API_URL` in the
Netlify site's environment variables to the **origin** of the deployed API
(for example, `https://ronvero-api.example.com`, without `/api`).

The Express API and MongoDB are not hosted by Netlify's static site deploy.
The root `render.yaml` defines a Render web service for `backend/` (free plan,
Singapore region, for initial demos). In Render, create a Blueprint from this
GitHub repository and provide `MONGO_URI` and `CLIENT_URL` when prompted. Use a
managed MongoDB Atlas cluster for `MONGO_URI`; set `CLIENT_URL` to the exact
production Netlify site origin, with no trailing slash. Render generates
separate strong values for both JWT secrets.

After Render deploys, set Netlify's `VITE_API_URL` to the Render service origin
(for example, `https://ronvero-api.onrender.com`, without `/api`) and trigger a
new Netlify deploy. If you use a Netlify deploy-preview URL for testing, add
that exact origin to the comma-separated `CLIENT_URL` value in Render as well.
Never commit `.env` files or put backend secrets in Netlify's `VITE_*`
variables. The free Render web service sleeps after 15 minutes without traffic
and is suitable for demos, not a production shop.

Seed the Atlas database with `npm run seed` from `backend/` only when it is
empty; this seed command clears existing catalog/demo records before
importing them.

For a local Git push, create an empty GitHub repository, add it as `origin`,
then push the current branch. The root `.gitignore` excludes local environment
files, dependencies, build output, and uploads.

## What's implemented

**Backend** — all 9 data models (Product, Category, Collection, User, Order,
Review, Coupon, Banner, Testimonial), JWT auth with refresh tokens + email
verification + password reset, Cloudinary image upload, a real pricing/coupon
engine, Stripe PaymentIntents, sales analytics aggregation, and a contact-form
endpoint. Verified: every file syntax-checked, the full ESM import graph
resolves cleanly, every seed document passes Mongoose schema validation, and
`npm audit` is clean (multer, nodemailer, and swiper were all bumped past
disclosed vulnerabilities; the frontend's `vite` devDependency was bumped to
v8 to clear a moderate dev-server-only esbuild advisory — confirmed the
production build still runs cleanly afterwards).

**Frontend** — every page in the original spec (Home, Shop, Product Details,
Cart, Checkout, Wishlist, Search, Categories, Collections, full auth flow,
account section, Admin dashboard with 7 management sections, static/legal
pages, 404), the full animation system (Lenis smooth scroll, GSAP
ScrollTrigger parallax + trace-line reveals, Framer Motion throughout,
SwiperJS carousels), Zustand for cart/wishlist/auth/UI state, and a
hand-rolled icon set + `cn()` helper so the project doesn't pull in any
dependency outside the originally-requested stack. `npm run build` completes
successfully (597 modules, ~254 kB gzipped JS).

## Known simplifications (worth knowing about before you demo this)

- **Newsletter signup** validates and submits cleanly but isn't wired to a
  database table or ESP (Mailchimp/Klaviyo) — the original spec's 9 named
  collections didn't include a subscribers table, so this is a clean
  integration point rather than a finished pipe.
- **Product image uploads** in the admin panel take pasted image URLs rather
  than a drag-and-drop uploader — the backend's Cloudinary upload endpoint
  (`POST /api/upload`) is real and working, it's just not wired into a
  dropzone UI yet.
- **"Frequently bought together"** on the product page is approximated via
  the existing related-products endpoint rather than a real
  recommendation/co-purchase model.
- Color variants in the admin product form share one image set rather than
  per-color image arrays (the schema supports per-color images; the admin
  *form* just doesn't expose that level of nesting yet).
- Nothing has been tested against a live MongoDB instance in the environment
  this was built in (no DB available there) — schema validation and the full
  import graph were both verified directly instead. Point it at a real
  `MONGO_URI` and it should come up clean, but it's worth a first smoke test
  on your end.

## Brand identity

Colors, fonts, and the "trace line" motif are all centralized in
`frontend/tailwind.config.js` and `frontend/src/index.css` — if RONVERO's
actual visual identity differs from what's here, that's the one place to
change it site-wide.


#Backend
npm start
#Frontend
npm run dev
ngrok http 5173

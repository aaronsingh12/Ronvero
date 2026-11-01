/**
 * Additive demo-content seeder that drives the real admin REST API.
 *
 * Unlike `seed.js` (which WIPES and rebuilds the catalog), this script only
 * *adds* a demo collection, product, banners, and testimonials if they are not
 * already present — so it is safe to run against a database that already holds
 * hand-created data. Because it goes through the HTTP API as an authenticated
 * admin, it also doubles as a smoke test of the admin create endpoints.
 *
 * Usage (backend must be running):  npm run seed:demo-content
 * Optional env: API_URL (default http://localhost:5000), ADMIN_USER, ADMIN_PASS.
 */
import 'dotenv/config';

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin';

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

let token = '';
async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${data.message || 'error'}`);
  return data;
}

async function main() {
  console.log(`→ Using API ${API}`);

  // 1. Authenticate as admin
  const login = await api('POST', '/api/auth/login', { email: ADMIN_USER, password: ADMIN_PASS });
  token = login.accessToken;
  console.log(`✓ Logged in as ${login.user.name} (${login.user.role})`);

  // 2. Ensure a category to attach the product to
  const cats = (await api('GET', '/api/categories')).categories;
  let category = cats[0];
  if (!category) {
    category = (
      await api('POST', '/api/categories', {
        name: 'Training Essentials',
        description: 'Everyday performance staples built for the gym floor and the street.',
        image: { url: img('photo-1517836357463-d25dfeac3438') },
      })
    ).category;
    console.log(`✓ Created category "${category.name}"`);
  } else {
    console.log(`• Using existing category "${category.name}"`);
  }

  // 3. Ensure a Collection
  const DEMO_COLLECTION = 'Summer 2026 Edit';
  const collections = (await api('GET', '/api/collections/admin/all')).collections;
  let collection = collections.find((c) => c.name === DEMO_COLLECTION);
  if (!collection) {
    collection = (
      await api('POST', '/api/collections', {
        name: DEMO_COLLECTION,
        tagline: 'Lightweight layers for warm-weather training',
        description: 'A capsule of breathable, sweat-wicking pieces designed for high-output summer sessions.',
        bannerImage: { url: img('photo-1483721310020-03333e577078') },
        isFeatured: true,
        isActive: true,
      })
    ).collection;
    console.log(`✓ Created collection "${collection.name}"`);
  } else {
    console.log(`• Collection "${DEMO_COLLECTION}" already exists`);
  }

  // 4. Ensure a demo Product (identified by SKU)
  const DEMO_SKU = 'RVR-DEMO-TEE-001';
  const adminProducts = (await api('GET', '/api/products/admin/all')).products;
  let product = adminProducts.find((p) => p.sku === DEMO_SKU);
  if (!product) {
    const productImages = [
      { url: img('photo-1521572163474-6864f9cf17ab'), alt: 'Aero Flex Training Tee — front' },
      { url: img('photo-1576566588028-4147f3842f27'), alt: 'Aero Flex Training Tee — side' },
      { url: img('photo-1618354691373-d851c5c3a990'), alt: 'Aero Flex Training Tee — fabric detail' },
      { url: img('photo-1583743814966-8936f5b7be1a'), alt: 'Aero Flex Training Tee — in motion' },
    ];
    product = (
      await api('POST', '/api/products', {
        name: 'Aero Flex Training Tee',
        shortDescription: 'Featherweight, sweat-wicking training tee with four-way stretch.',
        description:
          'The Aero Flex Training Tee is cut from a recycled performance knit that moves with you. ' +
          'Laser-cut ventilation, flatlock seams, and a lightweight four-way stretch keep you cool and ' +
          'unrestricted from warm-up to cooldown.',
        category: category._id,
        collections: collection ? [collection._id] : [],
        brand: 'RONVERO',
        price: 2499,
        discountPrice: 1899,
        images: productImages,
        colors: [
          { name: 'Graphite', hex: '#1E211D', images: productImages },
          { name: 'Ecru', hex: '#E7E1D5', images: productImages },
        ],
        sizes: [
          { value: 'S', stock: 15 },
          { value: 'M', stock: 20 },
          { value: 'L', stock: 12 },
          { value: 'XL', stock: 8 },
        ],
        sku: DEMO_SKU,
        tags: ['training', 'tee', 'summer', 'demo'],
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        status: 'active',
      })
    ).product;
    console.log(`✓ Created product "${product.name}" (${product.slug})`);
  } else {
    console.log(`• Product "${product.name}" (SKU ${DEMO_SKU}) already exists`);
  }

  // 5. Ensure Banners (hero + promo)
  const banners = (await api('GET', '/api/banners/admin/all')).banners;
  const wantBanners = [
    {
      position: 'hero',
      title: 'Built To Move',
      subtitle: 'The Summer 2026 Edit is here — breathable layers engineered for high-output days.',
      eyebrow: 'New season',
      image: { url: img('photo-1483721310020-03333e577078') },
      ctaText: 'Shop the edit',
      ctaLink: '/shop',
      theme: 'dark',
      displayOrder: 0,
      isActive: true,
    },
    {
      position: 'promo',
      title: 'Up to 25% off training essentials',
      subtitle: 'Limited-time pricing on this season’s core performance staples.',
      eyebrow: 'Offer',
      image: { url: img('photo-1518611012118-696072aa579a') },
      ctaText: 'Shop now',
      ctaLink: '/shop',
      theme: 'light',
      displayOrder: 1,
      isActive: true,
    },
  ];
  for (const b of wantBanners) {
    if (banners.some((x) => x.title === b.title)) {
      console.log(`• Banner "${b.title}" already exists`);
    } else {
      await api('POST', '/api/banners', b);
      console.log(`✓ Created ${b.position} banner "${b.title}"`);
    }
  }

  // 6. Ensure Testimonials
  const testimonials = (await api('GET', '/api/testimonials/admin/all')).testimonials;
  const wantTestimonials = [
    {
      name: 'Ishaan Mehra',
      role: 'Half-marathon runner',
      location: 'Mumbai',
      rating: 5,
      message: 'The Aero Flex tee is the first training top I forget I’m wearing. Stays dry through a full 15k.',
      isActive: true,
      displayOrder: 0,
    },
    {
      name: 'Priya Nair',
      role: 'CrossFit coach',
      location: 'Bengaluru',
      rating: 5,
      message: 'Fit and durability are spot on. My athletes keep asking where the kit is from.',
      isActive: true,
      displayOrder: 1,
    },
  ];
  for (const t of wantTestimonials) {
    if (testimonials.some((x) => x.name === t.name)) {
      console.log(`• Testimonial from "${t.name}" already exists`);
    } else {
      await api('POST', '/api/testimonials', t);
      console.log(`✓ Created testimonial from "${t.name}"`);
    }
  }

  console.log('\n✅ Demo content ready.');
}

main().catch((err) => {
  console.error('\n✗ Demo seeding failed:', err.message);
  process.exit(1);
});

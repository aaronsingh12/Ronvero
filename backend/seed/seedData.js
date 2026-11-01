// Placeholder imagery via picsum.photos (deterministic seeds so images stay stable across runs).
// Swap these for real Cloudinary URLs once product photography exists.
const img = (seed, w = 900, h = 1100) => ({ url: `https://picsum.photos/seed/${seed}/${w}/${h}`, publicId: '' });

export const categoriesData = [
  {
    name: 'Run',
    subtitle: 'Engineered for the mile that matters',
    description: 'Lightweight, breathable pieces built around pace — from tempo runs to race day.',
    image: img('ronvero-cat-run', 1200, 1400),
    isFeatured: true,
    displayOrder: 1,
  },
  {
    name: 'Train',
    subtitle: 'Built to move under load',
    description: 'Compression, structure and stretch for lifting, HIIT and everything in between.',
    image: img('ronvero-cat-train', 1200, 1400),
    isFeatured: true,
    displayOrder: 2,
  },
  {
    name: 'Outerwear',
    subtitle: 'Weather is not a rest day',
    description: 'Shells and layers that hold up on the days you almost didn\u2019t go out.',
    image: img('ronvero-cat-outerwear', 1200, 1400),
    isFeatured: true,
    displayOrder: 3,
  },
  {
    name: 'Recovery',
    subtitle: 'Off the clock, still dialed in',
    description: 'Soft-touch fleece and joggers for the hours between sessions.',
    image: img('ronvero-cat-recovery', 1200, 1400),
    isFeatured: true,
    displayOrder: 4,
  },
  {
    name: 'Accessories',
    subtitle: 'The kit that finishes the fit',
    description: 'Caps, socks, bags and bottles — the small stuff that earns its place.',
    image: img('ronvero-cat-accessories', 1200, 1400),
    isFeatured: false,
    displayOrder: 5,
  },
];

const colorSet = (names) =>
  names.map((n, i) => ({ name: n.name, hex: n.hex, images: [img(`ronvero-${n.slug}-${i}`)] }));

const sizeSet = (values, stock = 24) => values.map((v) => ({ value: v, stock }));

/**
 * @param {Record<string, import('mongoose').Types.ObjectId>} categoryIdByName
 */
export function buildProducts(categoryIdByName) {
  return [
    {
      name: 'Momentum Tee',
      shortDescription: 'A featherweight tee that disappears on tempo days.',
      description:
        'The Momentum Tee is cut from a four-way stretch mesh that moves air where you need it most. Flatlock seams sit flush against the skin to kill chafe on long runs, and a dropped hem keeps it in place from the first mile to the last.',
      category: categoryIdByName.Run,
      price: 1799,
      discountPrice: null,
      images: [img('ronvero-momentum-tee-1'), img('ronvero-momentum-tee-2')],
      colors: colorSet([
        { name: 'Graphite', hex: '#1E211D', slug: 'momentum-tee-graphite' },
        { name: 'Ember', hex: '#FF4A2E', slug: 'momentum-tee-ember' },
      ]),
      sizes: sizeSet(['XS', 'S', 'M', 'L', 'XL']),
      specifications: [
        { key: 'Fabric', value: '92% recycled polyester, 8% elastane' },
        { key: 'Fit', value: 'Regular, slightly dropped hem' },
        { key: 'Weight', value: '118 gsm' },
      ],
      tags: ['running', 'lightweight', 'breathable'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
    },
    {
      name: 'Aero-Mesh Singlet',
      shortDescription: 'Race-day ventilation without the flap.',
      description:
        'Built for the days heat is the real opponent. Laser-cut mesh panels run the length of the spine for airflow, and a bonded hem keeps the singlet from riding up mid-stride.',
      category: categoryIdByName.Run,
      price: 1599,
      discountPrice: 1279,
      images: [img('ronvero-aero-singlet-1'), img('ronvero-aero-singlet-2')],
      colors: colorSet([
        { name: 'Chalk', hex: '#F5F7F3', slug: 'aero-singlet-chalk' },
        { name: 'Trace Blue', hex: '#2C3FE0', slug: 'aero-singlet-blue' },
      ]),
      sizes: sizeSet(['S', 'M', 'L', 'XL'], 14),
      specifications: [
        { key: 'Fabric', value: '100% recycled polyester mesh' },
        { key: 'Fit', value: 'Race fit' },
      ],
      tags: ['running', 'race day', 'sale'],
      isNewArrival: true,
    },
    {
      name: 'Negative Split Shorts',
      shortDescription: '2-in-1 shorts with a compression liner.',
      description:
        'Named for the pacing strategy, built the same way — nothing wasted. A brief liner stays put under a lightweight woven outer with a zip security pocket for a card and key.',
      category: categoryIdByName.Run,
      price: 2199,
      discountPrice: null,
      images: [img('ronvero-negsplit-shorts-1'), img('ronvero-negsplit-shorts-2')],
      colors: colorSet([
        { name: 'Graphite', hex: '#1E211D', slug: 'negsplit-graphite' },
        { name: 'Sandstone', hex: '#C9C0AC', slug: 'negsplit-sandstone' },
      ]),
      sizes: sizeSet(['XS', 'S', 'M', 'L', 'XL'], 18),
      specifications: [
        { key: 'Inseam', value: '5" liner, 7" outer' },
        { key: 'Pockets', value: 'Zip security pocket, side pockets' },
      ],
      tags: ['running', 'shorts'],
      isBestSeller: true,
    },
    {
      name: 'Tempo Tight 7/8',
      shortDescription: 'Squat-proof compression for long runs and lifts.',
      description:
        'A four-way stretch compressive knit with a wide waistband that stays put through dynamic movement. The 7/8 length clears the ankle for track sessions and treadmill work alike.',
      category: categoryIdByName.Run,
      price: 2799,
      discountPrice: null,
      images: [img('ronvero-tempo-tight-1'), img('ronvero-tempo-tight-2')],
      colors: colorSet([
        { name: 'Graphite', hex: '#1E211D', slug: 'tempo-tight-graphite' },
        { name: 'Deep Trace', hex: '#141A3D', slug: 'tempo-tight-navy' },
      ]),
      sizes: sizeSet(['XS', 'S', 'M', 'L', 'XL'], 20),
      specifications: [{ key: 'Fabric', value: '78% nylon, 22% elastane' }],
      tags: ['running', 'tights', 'compression'],
      isFeatured: true,
    },
    {
      name: 'Forge Compression Tank',
      shortDescription: 'Second-skin support for heavy lift days.',
      description:
        'A compressive tank that keeps you honest on form. Bonded seams eliminate hotspots under a barbell, and the fabric holds its shape set after set.',
      category: categoryIdByName.Train,
      price: 1899,
      discountPrice: null,
      images: [img('ronvero-forge-tank-1'), img('ronvero-forge-tank-2')],
      colors: colorSet([
        { name: 'Graphite', hex: '#1E211D', slug: 'forge-tank-graphite' },
        { name: 'Ember', hex: '#FF4A2E', slug: 'forge-tank-ember' },
      ]),
      sizes: sizeSet(['S', 'M', 'L', 'XL'], 22),
      tags: ['training', 'compression', 'gym'],
      isNewArrival: true,
    },
    {
      name: 'Ironclad Jogger',
      shortDescription: 'Tapered training joggers built for the rack, not the sofa.',
      description:
        'A tapered leg with a gusseted crotch for full range of motion at the bottom of a squat. Zip pockets keep your phone secure through supersets.',
      category: categoryIdByName.Train,
      price: 2999,
      discountPrice: 2399,
      images: [img('ronvero-ironclad-jogger-1'), img('ronvero-ironclad-jogger-2')],
      colors: colorSet([
        { name: 'Graphite', hex: '#1E211D', slug: 'ironclad-graphite' },
        { name: 'Stone', hex: '#8C8778', slug: 'ironclad-stone' },
      ]),
      sizes: sizeSet(['S', 'M', 'L', 'XL', 'XXL'], 16),
      tags: ['training', 'joggers', 'sale'],
      isBestSeller: true,
    },
    {
      name: 'Overload Hoodie',
      shortDescription: 'Heavyweight fleece for the walk in and the warm-up.',
      description:
        'A brushed-back fleece hoodie with a double-layered hood that holds its shape. Roomy enough to throw over a training kit, structured enough to wear on its own.',
      category: categoryIdByName.Train,
      price: 3299,
      discountPrice: null,
      images: [img('ronvero-overload-hoodie-1'), img('ronvero-overload-hoodie-2')],
      colors: colorSet([
        { name: 'Graphite', hex: '#1E211D', slug: 'overload-graphite' },
        { name: 'Chalk', hex: '#F5F7F3', slug: 'overload-chalk' },
      ]),
      sizes: sizeSet(['S', 'M', 'L', 'XL'], 20),
      tags: ['training', 'hoodie', 'fleece'],
      isFeatured: true,
    },
    {
      name: 'Windline Shell Jacket',
      shortDescription: 'A packable shell that cuts the wind on exposed miles.',
      description:
        'Windproof, water-resistant and small enough to tie around your waist when the weather turns. Reflective trims keep you visible on early starts.',
      category: categoryIdByName.Outerwear,
      price: 3799,
      discountPrice: null,
      images: [img('ronvero-windline-jacket-1'), img('ronvero-windline-jacket-2')],
      colors: colorSet([
        { name: 'Graphite', hex: '#1E211D', slug: 'windline-graphite' },
        { name: 'Trace Blue', hex: '#2C3FE0', slug: 'windline-blue' },
      ]),
      sizes: sizeSet(['S', 'M', 'L', 'XL'], 15),
      specifications: [{ key: 'Weather rating', value: 'Water-resistant to 5,000mm' }],
      tags: ['outerwear', 'jacket', 'running'],
      isNewArrival: true,
    },
    {
      name: 'Thermal Trace Jacket',
      shortDescription: 'A brushed thermal layer for sub-10\u00b0C starts.',
      description:
        'Brushed thermal fabric traps heat without the bulk. A high collar and thumbhole cuffs seal out the cold on the walk to the start line.',
      category: categoryIdByName.Outerwear,
      price: 4299,
      discountPrice: 3649,
      images: [img('ronvero-thermal-jacket-1'), img('ronvero-thermal-jacket-2')],
      colors: colorSet([{ name: 'Graphite', hex: '#1E211D', slug: 'thermal-graphite' }]),
      sizes: sizeSet(['S', 'M', 'L', 'XL'], 10),
      tags: ['outerwear', 'thermal', 'sale'],
    },
    {
      name: 'Restday Fleece',
      shortDescription: 'The layer you reach for after every session.',
      description:
        'Oversized and brush-backed, the Restday Fleece is built for the couch as much as the cooldown walk. A dropped shoulder seam keeps it easy through the arms.',
      category: categoryIdByName.Recovery,
      price: 2599,
      discountPrice: null,
      images: [img('ronvero-restday-fleece-1'), img('ronvero-restday-fleece-2')],
      colors: colorSet([
        { name: 'Sandstone', hex: '#C9C0AC', slug: 'restday-sandstone' },
        { name: 'Graphite', hex: '#1E211D', slug: 'restday-graphite' },
      ]),
      sizes: sizeSet(['XS', 'S', 'M', 'L', 'XL'], 20),
      tags: ['recovery', 'fleece', 'loungewear'],
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Afterburn Sweatpant',
      shortDescription: 'A relaxed jogger for the hours after training.',
      description:
        'Soft-brushed loopback cotton with a relaxed leg and ribbed cuff — built for the walk home, not the workout.',
      category: categoryIdByName.Recovery,
      price: 2199,
      discountPrice: null,
      images: [img('ronvero-afterburn-1'), img('ronvero-afterburn-2')],
      colors: colorSet([
        { name: 'Chalk', hex: '#F5F7F3', slug: 'afterburn-chalk' },
        { name: 'Graphite', hex: '#1E211D', slug: 'afterburn-graphite' },
      ]),
      sizes: sizeSet(['S', 'M', 'L', 'XL'], 18),
      tags: ['recovery', 'sweatpants'],
    },
    {
      name: 'Tracefoam Cap',
      shortDescription: 'A sweat-wicking cap with a low-profile crown.',
      description: 'An unstructured five-panel cap with a moisture-wicking sweatband and reflective trace stitching along the seam.',
      category: categoryIdByName.Accessories,
      price: 899,
      discountPrice: null,
      images: [img('ronvero-cap-1')],
      colors: colorSet([
        { name: 'Graphite', hex: '#1E211D', slug: 'cap-graphite' },
        { name: 'Ember', hex: '#FF4A2E', slug: 'cap-ember' },
      ]),
      sizes: sizeSet(['One Size'], 40),
      tags: ['accessories', 'cap'],
    },
    {
      name: 'Grip Ankle Socks (3-Pack)',
      shortDescription: 'Cushioned ankle socks with an arch-hugging weave.',
      description: 'A three-pack of ankle socks with targeted cushioning at the heel and forefoot, plus an arch band that keeps them from slipping mid-run.',
      category: categoryIdByName.Accessories,
      price: 699,
      discountPrice: null,
      images: [img('ronvero-socks-1')],
      colors: colorSet([{ name: 'Mixed', hex: '#8C8778', slug: 'socks-mixed' }]),
      sizes: sizeSet(['S/M', 'L/XL'], 35),
      tags: ['accessories', 'socks'],
      isBestSeller: true,
    },
    {
      name: 'Cadence Sling Bag',
      shortDescription: 'A lightweight sling built for gym-to-street days.',
      description: 'A water-resistant sling bag sized for a phone, keys and a change of socks — nothing you don\u2019t need, nothing missing.',
      category: categoryIdByName.Accessories,
      price: 1499,
      discountPrice: null,
      images: [img('ronvero-sling-bag-1')],
      colors: colorSet([{ name: 'Graphite', hex: '#1E211D', slug: 'sling-graphite' }]),
      sizes: sizeSet(['One Size'], 25),
      tags: ['accessories', 'bag'],
      isNewArrival: true,
    },
  ];
}

/** @param {Record<string, import('mongoose').Types.ObjectId>} productIdByName */
export function buildCollections(productIdByName) {
  return [
    {
      name: 'Momentum',
      tagline: 'The run kit, all in one place',
      description: 'Everything that earns a spot on race week — tempo tees, race singlets and compression tights.',
      bannerImage: img('ronvero-collection-momentum', 1600, 900),
      products: [
        productIdByName['Momentum Tee'],
        productIdByName['Aero-Mesh Singlet'],
        productIdByName['Negative Split Shorts'],
        productIdByName['Tempo Tight 7/8'],
      ].filter(Boolean),
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: 'Monsoon Shell',
      tagline: 'Built for the season that doesn\u2019t cancel training',
      description: 'Water-resistant shells and thermal layers for runs that don\u2019t wait for clear skies.',
      bannerImage: img('ronvero-collection-monsoon', 1600, 900),
      products: [
        productIdByName['Windline Shell Jacket'],
        productIdByName['Thermal Trace Jacket'],
      ].filter(Boolean),
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: 'After Hours',
      tagline: 'For the hours between sessions',
      description: 'Fleece, joggers and soft layers for recovery days.',
      bannerImage: img('ronvero-collection-afterhours', 1600, 900),
      products: [
        productIdByName['Restday Fleece'],
        productIdByName['Afterburn Sweatpant'],
        productIdByName['Overload Hoodie'],
      ].filter(Boolean),
      isFeatured: false,
      displayOrder: 3,
    },
  ];
}

export const bannersData = [
  {
    position: 'hero',
    eyebrow: 'New season',
    title: 'Train in motion.',
    subtitle: 'Performance activewear engineered for the mile, the lift, and everything after.',
    image: { url: '/images/hero/run-at-dawn-desktop.jpg', publicId: '' },
    mobileImage: { url: '/images/hero/run-at-dawn-mobile.jpg', publicId: '' },
    ctaText: 'Shop the drop',
    ctaLink: '/shop',
    theme: 'dark',
    displayOrder: 1,
  },
  {
    position: 'promo',
    eyebrow: 'Limited run',
    title: 'The Monsoon Shell edit',
    subtitle: 'Water-resistant layers for training that doesn\u2019t wait for clear skies.',
    image: img('ronvero-promo-monsoon', 1600, 800),
    ctaText: 'Explore outerwear',
    ctaLink: '/shop?category=outerwear',
    theme: 'light',
    displayOrder: 2,
  },
  {
    position: 'lifestyle',
    eyebrow: 'Off the clock',
    title: 'Recovery is part of the plan',
    subtitle: 'Soft-touch fleece for the hours after training ends.',
    image: img('ronvero-lifestyle-1', 1600, 1000),
    ctaText: 'Shop recovery',
    ctaLink: '/shop?category=recovery',
    theme: 'light',
    displayOrder: 3,
  },
];

export const testimonialsData = [
  {
    name: 'Ishaan Verma',
    role: 'Marathon runner',
    location: 'Delhi',
    avatar: img('ronvero-avatar-1', 200, 200),
    rating: 5,
    message:
      'The Momentum Tee has replaced every other running top I own. No chafing at 30km, which is the only review that matters to me.',
    displayOrder: 1,
  },
  {
    name: 'Priya Nair',
    role: 'Strength coach',
    location: 'Bengaluru',
    avatar: img('ronvero-avatar-2', 200, 200),
    rating: 5,
    message:
      'I recommend the Forge Compression Tank to every client who complains about shoulder chafing on bench day. Holds its shape after a full season of washes.',
    displayOrder: 2,
  },
  {
    name: 'Arjun Mehta',
    role: 'Half-marathon PB chaser',
    location: 'Pune',
    avatar: img('ronvero-avatar-3', 200, 200),
    rating: 4,
    message:
      'The Windline Shell got me through an entire monsoon training block. Packs down small enough that I forget it\u2019s in my belt.',
    displayOrder: 3,
  },
  {
    name: 'Meera Kulkarni',
    role: 'Yoga & mobility instructor',
    location: 'Mumbai',
    avatar: img('ronvero-avatar-4', 200, 200),
    rating: 5,
    message:
      'The Restday Fleece is the first thing I put on after every class. Soft enough to teach in, sharp enough to wear out.',
    displayOrder: 4,
  },
];

export const couponsData = [
  {
    code: 'FIRSTRUN10',
    description: '10% off your first order',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 1500,
    maxDiscount: 800,
    usageLimit: null,
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'WELCOME200',
    description: '\u20b9200 off orders over \u20b92,500',
    discountType: 'fixed',
    discountValue: 200,
    minPurchase: 2500,
    usageLimit: 500,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
];

export const adminUserData = {
  name: 'RONVERO Admin',
  email: 'admin@ronvero.local',
  password: 'admin',
  role: 'admin',
  isEmailVerified: true,
};

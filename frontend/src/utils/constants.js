export const BRAND_NAME = 'RONVERO';

export const NAV_LINKS = [
  {
    label: 'Run',
    to: '/shop?category=run',
    megaMenu: {
      description: 'Engineered for the mile that matters.',
      columns: [
        {
          heading: 'Shop Run',
          links: [
            { label: 'All Run', to: '/shop?category=run' },
            { label: 'Tees & Tanks', to: '/shop?category=run&type=tops' },
            { label: 'Shorts & Tights', to: '/shop?category=run&type=bottoms' },
          ],
        },
        {
          heading: 'Featured',
          links: [
            { label: 'The Momentum edit', to: '/collections/momentum' },
            { label: 'New arrivals', to: '/shop?sort=newest' },
          ],
        },
      ],
    },
  },
  {
    label: 'Train',
    to: '/shop?category=train',
    megaMenu: {
      description: 'Built to move under load.',
      columns: [
        {
          heading: 'Shop Train',
          links: [
            { label: 'All Train', to: '/shop?category=train' },
            { label: 'Compression', to: '/shop?category=train&type=compression' },
            { label: 'Joggers', to: '/shop?category=train&type=joggers' },
          ],
        },
        {
          heading: 'Featured',
          links: [
            { label: 'Best sellers', to: '/shop?sort=bestselling' },
            { label: 'After Hours edit', to: '/collections/after-hours' },
          ],
        },
      ],
    },
  },
  {
    label: 'Outerwear',
    to: '/shop?category=outerwear',
  },
  {
    label: 'Recovery',
    to: '/shop?category=recovery',
  },
  {
    label: 'Accessories',
    to: '/shop?category=accessories',
  },
];

export const FOOTER_LINKS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Run', to: '/shop?category=run' },
      { label: 'Train', to: '/shop?category=train' },
      { label: 'Outerwear', to: '/shop?category=outerwear' },
      { label: 'Recovery', to: '/shop?category=recovery' },
      { label: 'Accessories', to: '/shop?category=accessories' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Contact us', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Shipping & returns', to: '/faq#shipping' },
      { label: 'Size guide', to: '/faq#sizing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About RONVERO', to: '/about' },
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Terms of service', to: '/terms' },
    ],
  },
];

export const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'S/M', 'L/XL', 'One Size'];

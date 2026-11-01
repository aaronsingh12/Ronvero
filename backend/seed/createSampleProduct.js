import 'dotenv/config';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

const sampleCategory = {
  name: 'Training Essentials',
  slug: 'training-essentials',
  subtitle: 'Daily performance layers',
  description: 'Core RONVERO training pieces for gym, running and everyday movement.',
  image: {
    url: '/images/hero/strength-session.jpg',
    publicId: '',
  },
  isFeatured: true,
  displayOrder: 1,
};

const createSampleProduct = async () => {
  await connectDB();

  const category = await Category.findOneAndUpdate({ name: sampleCategory.name }, sampleCategory, {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });

  const product = await Product.findOneAndUpdate(
    { sku: 'RNV-SAMPLE-PERF-TEE' },
    {
      name: 'RONVERO Motion Training Tee',
      slug: 'ronvero-motion-training-tee-sample',
      shortDescription: 'Breathable sample tee for admin dashboard testing.',
      description:
        'A lightweight training tee added as a safe sample product so the admin dashboard, catalog refresh and product cards can be tested end to end.',
      category: category._id,
      brand: 'RONVERO',
      price: 1499,
      discountPrice: 1199,
      sku: 'RNV-SAMPLE-PERF-TEE',
      images: [
        { url: '/images/hero/run-at-dawn-desktop.jpg', publicId: '', alt: 'RONVERO Motion Training Tee' },
        { url: '/images/hero/strength-session.jpg', publicId: '', alt: 'RONVERO Motion Training Tee lifestyle' },
      ],
      colors: [{ name: 'Graphite', hex: '#1E211D' }],
      sizes: [
        { value: 'S', stock: 10 },
        { value: 'M', stock: 14 },
        { value: 'L', stock: 8 },
      ],
      tags: ['sample', 'training', 'tee'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      status: 'active',
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await Notification.create({
    type: 'product',
    title: 'Sample product ready',
    message: `${product.name} is active and visible in the catalog.`,
    severity: 'success',
    entityType: 'Product',
    entityId: product._id,
    metadata: { sku: product.sku },
  });

  console.log(`Sample product ready -> ${product.name}`);
  process.exit(0);
};

createSampleProduct().catch((error) => {
  console.error(error);
  process.exit(1);
});

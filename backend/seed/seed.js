import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';

import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';
import Banner from '../models/Banner.js';
import Testimonial from '../models/Testimonial.js';
import Coupon from '../models/Coupon.js';

import {
  categoriesData,
  buildProducts,
  buildCollections,
  bannersData,
  testimonialsData,
  couponsData,
  adminUserData,
} from './seedData.js';

const destroy = async () => {
  await Promise.all([
    User.deleteMany({ email: { $in: [adminUserData.email, 'admin@ronvero.com'] } }),
    Category.deleteMany(),
    Product.deleteMany(),
    Collection.deleteMany(),
    Banner.deleteMany(),
    Testimonial.deleteMany(),
    Coupon.deleteMany(),
  ]);
  console.log('Destroyed existing RONVERO seed data.');
};

const importData = async () => {
  await destroy();

  const categories = await Category.create(categoriesData);
  const categoryIdByName = Object.fromEntries(categories.map((c) => [c.name, c._id]));
  console.log(`Seeded ${categories.length} categories`);

  const products = await Product.create(buildProducts(categoryIdByName));
  const productIdByName = Object.fromEntries(products.map((p) => [p.name, p._id]));
  console.log(`Seeded ${products.length} products`);

  const collections = await Collection.create(buildCollections(productIdByName));
  console.log(`Seeded ${collections.length} collections`);

  await Banner.create(bannersData);
  console.log(`Seeded ${bannersData.length} banners`);

  await Testimonial.create(testimonialsData);
  console.log(`Seeded ${testimonialsData.length} testimonials`);

  await Coupon.create(couponsData);
  console.log(`Seeded ${couponsData.length} coupons`);

  const adminUser = new User(adminUserData);
  await adminUser.save({ validateBeforeSave: false });
  console.log('Seeded admin user -> admin / admin');

  console.log('\nSeed complete.');
};

const run = async () => {
  await connectDB();

  if (process.argv.includes('--destroy')) {
    await destroy();
  } else {
    await importData();
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

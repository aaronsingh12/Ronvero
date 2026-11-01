import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { adminUserData } from './seedData.js';

const run = async () => {
  await connectDB();

  const admin = await User.findOne({ email: adminUserData.email }).select('+password');
  if (admin) {
    admin.name = adminUserData.name;
    admin.password = adminUserData.password;
    admin.role = 'admin';
    admin.isEmailVerified = true;
    await admin.save({ validateBeforeSave: false });
    console.log('Reset demo admin -> admin / admin');
  } else {
    const newAdmin = new User(adminUserData);
    await newAdmin.save({ validateBeforeSave: false });
    console.log('Created demo admin -> admin / admin');
  }

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Could not create demo admin:', error);
  await mongoose.connection.close();
  process.exit(1);
});

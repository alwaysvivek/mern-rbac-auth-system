const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config/env');

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@purplemerit.com',
    password: 'Admin@123',
    role: 'admin',
    status: 'active',
  },
  {
    name: 'Manager User',
    email: 'manager@purplemerit.com',
    password: 'Manager@123',
    role: 'manager',
    status: 'active',
  },
  {
    name: 'John Doe',
    email: 'john@purplemerit.com',
    password: 'User@123',
    role: 'user',
    status: 'active',
  },
  {
    name: 'Jane Smith',
    email: 'jane@purplemerit.com',
    password: 'User@123',
    role: 'user',
    status: 'active',
  },
  // Additional users for pagination/search demo
  { name: 'Robert Johnson', email: 'robert@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Emily Davis', email: 'emily@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Michael Wilson', email: 'michael@example.com', password: 'User@123', role: 'user', status: 'inactive' },
  { name: 'Sarah Brown', email: 'sarah@example.com', password: 'User@123', role: 'manager', status: 'active' },
  { name: 'David Martinez', email: 'david@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Jessica Taylor', email: 'jessica@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Chris Anderson', email: 'chris@example.com', password: 'User@123', role: 'user', status: 'suspended' },
  { name: 'Amanda Thomas', email: 'amanda@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Daniel Jackson', email: 'daniel@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Laura White', email: 'laura@example.com', password: 'User@123', role: 'user', status: 'inactive' },
  { name: 'Kevin Harris', email: 'kevin@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Megan Clark', email: 'megan@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Ryan Lewis', email: 'ryan@example.com', password: 'User@123', role: 'user', status: 'active' },
  { name: 'Nicole Walker', email: 'nicole@example.com', password: 'User@123', role: 'manager', status: 'active' },
  { name: 'Sophia Lee', email: 'sophia@example.com', password: 'User@123', role: 'user', status: 'active' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Get admin user to set as createdBy for others
    const admin = await User.create(seedUsers[0]);
    console.log(`👤 Created admin: ${admin.email}`);

    // Create rest with createdBy = admin
    for (let i = 1; i < seedUsers.length; i++) {
      const user = await User.create({
        ...seedUsers[i],
        createdBy: admin._id,
        updatedBy: admin._id,
      });
      console.log(`👤 Created ${user.role}: ${user.email}`);
    }

    console.log(`\n✅ Seeded ${seedUsers.length} users successfully!`);
    console.log('\n📋 Login Credentials:');
    console.log('━'.repeat(50));
    console.log('Admin:   admin@purplemerit.com   / Admin@123');
    console.log('Manager: manager@purplemerit.com / Manager@123');
    console.log('User:    john@purplemerit.com    / User@123');
    console.log('━'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();

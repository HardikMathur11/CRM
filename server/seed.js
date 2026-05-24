const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Lead = require('./src/models/Lead');
const Client = require('./src/models/Client');
const FollowUp = require('./src/models/FollowUp');
const Product = require('./src/models/Product');

const seedDatabase = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected!');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Client.deleteMany({});
    await FollowUp.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Seed Users (passwords will be hashed in Pre-save hook automatically)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@crm.com',
      password: 'admin1234',
      role: 'admin',
      phone: '9876543210',
      monthlyTarget: 100000,
      isActive: true
    });

    const manager = await User.create({
      name: 'Manager User',
      email: 'manager@crm.com',
      password: 'manager1234',
      role: 'manager',
      phone: '9876543211',
      monthlyTarget: 75000,
      isActive: true
    });

    const bda = await User.create({
      name: 'BDA User',
      email: 'bda@crm.com',
      password: 'bda1234',
      role: 'bda',
      phone: '9876543212',
      monthlyTarget: 50000,
      isActive: true
    });

    console.log('Seeded 3 demo users successfully.');

    // 2. Seed Sample Leads
    const lead1 = await Lead.create({
      contactName: 'Rahul Sharma',
      companyName: 'Apex Steel Industries',
      phone: '9123456789',
      email: 'rahul@apexsteel.com',
      status: 'New',
      priority: 'Medium',
      estimatedValue: 15000,
      leadSource: 'Website',
      location: 'Mumbai, MH',
      assignedTo: bda._id,
      createdBy: admin._id,
      notes: [
        { text: 'Created lead from contact form submission.', addedBy: 'Admin User' }
      ]
    });

    const lead2 = await Lead.create({
      contactName: 'Amit Patel',
      companyName: 'Gujarat Plastics Ltd',
      phone: '9823456780',
      email: 'amit@gujaratplastics.com',
      status: 'Proposal Sent',
      priority: 'High',
      estimatedValue: 35000,
      leadSource: 'Referral',
      location: 'Ahmedabad, GJ',
      assignedTo: bda._id,
      createdBy: manager._id,
      notes: [
        { text: 'Sent formal product catalogue.', addedBy: 'Manager User' },
        { text: 'Client requested price quotation for 500 units.', addedBy: 'BDA User' }
      ]
    });

    const lead3 = await Lead.create({
      contactName: 'Vikram Singh',
      companyName: 'Noida Gears Corp',
      phone: '9812345671',
      email: 'vikram@noidagears.in',
      status: 'Won',
      priority: 'High',
      estimatedValue: 50000,
      leadSource: 'Direct',
      location: 'Noida, UP',
      assignedTo: manager._id,
      createdBy: manager._id,
      isConverted: true,
      convertedAt: new Date(),
      notes: [
        { text: 'Negotiation completed. Won the deal!', addedBy: 'Manager User' }
      ]
    });

    const lead4 = await Lead.create({
      contactName: 'Rajesh Gupta',
      companyName: 'Gupta Steel Fabricators',
      phone: '9871234560',
      email: 'rajesh@guptasteel.com',
      status: 'Won',
      priority: 'High',
      estimatedValue: 45000,
      leadSource: 'Direct',
      location: 'Faridabad, HR',
      assignedTo: bda._id,
      createdBy: bda._id,
      isConverted: true,
      convertedAt: new Date(),
      notes: [
        { text: 'Onboarding completed and billing setup done.', addedBy: 'BDA User' }
      ]
    });

    console.log('Seeded 4 sample leads successfully.');

    // 3. Seed Client (Converted from lead3)
    const client = await Client.create({
      companyName: lead3.companyName,
      contactName: lead3.contactName,
      phone: lead3.phone,
      email: lead3.email,
      gstNumber: '09AAACN8374D1Z2',
      city: 'Noida',
      state: 'Uttar Pradesh',
      convertedFrom: lead3._id,
      assignedTo: manager._id,
      totalRevenue: 50000,
      isActive: true
    });

    const client2 = await Client.create({
      companyName: lead4.companyName,
      contactName: lead4.contactName,
      phone: lead4.phone,
      email: lead4.email,
      gstNumber: '06BBBBP8734A1Z3',
      city: 'Faridabad',
      state: 'Haryana',
      convertedFrom: lead4._id,
      assignedTo: bda._id,
      totalRevenue: 45000,
      isActive: true
    });

    console.log('Seeded 2 clients converted from Leads.');

    // 4. Seed FollowUps
    await FollowUp.create({
      lead: lead1._id,
      assignedTo: bda._id,
      type: 'Call',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      notes: 'Initial introduction call to understand requirements.',
      status: 'Pending'
    });

    await FollowUp.create({
      lead: lead2._id,
      assignedTo: bda._id,
      type: 'Meeting',
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue (2 days ago)
      notes: 'Discuss quotation numbers and payment terms.',
      status: 'Pending'
    });

    await FollowUp.create({
      lead: lead3._id,
      assignedTo: manager._id,
      type: 'Email',
      scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Done
      notes: 'Send contract agreement signature copy.',
      status: 'Done',
      outcome: 'Contract signed by Vikram Singh.'
    });

    console.log('Seeded 3 follow-ups successfully.');

    // 5. Seed Products
    await Product.create([
      { name: 'Seamless Steel Pipes', description: 'High quality rust-resistant steel pipes.', price: 1500, category: 'Steel', sku: 'STL-PIPE-001' },
      { name: 'Industrial Plastic Sheets', description: 'Heavy duty polymer plastic sheets.', price: 800, category: 'Plastic', sku: 'PLS-SHT-002' },
      { name: 'Precision Gear Assemblies', description: 'Standard gear assemblies for high torque motors.', price: 5000, category: 'Gears', sku: 'GER-ASM-003' }
    ]);
    console.log('Seeded 3 products successfully.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error failed:', error);
    process.exit(1);
  }
};

seedDatabase();

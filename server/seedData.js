const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Brand = require('./models/Brand');
const Purchase = require('./models/Purchase');
const AdvancePayment = require('./models/AdvancePayment');
const StockTransaction = require('./models/StockTransaction');

const sampleCustomers = [
  {
    customId: 'CUST-101',
    name: 'SAI MOHAN MARKETING',
    phone: '86020 05900',
    gst: '22ADWPN7742F1Z7',
    address: 'Plot No. 45, Commercial Complex, Raipur, Chhattisgarh - 492001',
    debit: 307506.00,
    credit: 307500.00,
    status: 'Active',
  },
  {
    customId: 'CUST-102',
    name: 'SRI SAI TRADERS',
    phone: '98765 43210',
    gst: '33AAACR1234F1Z1',
    address: 'Main Market Road, Sivakasi, Tamil Nadu - 626123',
    debit: 150000.00,
    credit: 150000.00,
    status: 'Active',
  },
  {
    customId: 'CUST-103',
    name: 'SHARMA CRACKERS STORE',
    phone: '98456 12370',
    gst: '27AABCS5678G2Z3',
    address: 'Station Road, Mumbai, Maharashtra - 400001',
    debit: 225000.00,
    credit: 200000.00,
    status: 'Active',
  },
  {
    customId: 'CUST-104',
    name: 'MEENA STORES & FIREWORKS',
    phone: '91234 56790',
    gst: '36AAAFM9012H1Z5',
    address: 'Market Yard, Hyderabad, Telangana - 500001',
    debit: 85000.00,
    credit: 85000.00,
    status: 'Active',
  },
];

const sampleBrands = [
  'SIMBA FW',
  'Standard Crackers',
  'Ajanta Brand',
  'Sri Kaliswari Fireworks',
  'Coronation Fireworks',
  'Vadivel Pyrotechnics',
  'Ayyan Fireworks',
];

const sampleProducts = [
  {
    brand: 'Standard Crackers',
    name: 'Flower Pot (Deluxe)',
    category: 'Flower Pots',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
    pricePerPiece: 240,
    piecesPerCase: 10,
    availableCases: 100,
    minStockCases: 15,
  },
  {
    brand: 'Standard Crackers',
    name: '10cm Electric Sparklers',
    category: 'Sparklers',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80',
    pricePerPiece: 120,
    piecesPerCase: 10,
    availableCases: 150,
    minStockCases: 20,
  },
  {
    brand: 'Ajanta Brand',
    name: 'Ground Chakkar (Big)',
    category: 'Ground Chakkars',
    image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80',
    pricePerPiece: 180,
    piecesPerCase: 20,
    availableCases: 80,
    minStockCases: 10,
  },
  {
    brand: 'Ajanta Brand',
    name: 'Whistling Rockets',
    category: 'Rockets',
    image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=300&q=80',
    pricePerPiece: 210,
    piecesPerCase: 25,
    availableCases: 45,
    minStockCases: 15,
  },
  {
    brand: 'Sri Kaliswari Fireworks',
    name: 'Hydro Atom Bomb',
    category: 'Atom Bombs',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80',
    pricePerPiece: 160,
    piecesPerCase: 10,
    availableCases: 120,
    minStockCases: 25,
  },
  {
    brand: 'Coronation Fireworks',
    name: '30-Shot Multi Color Aerial',
    category: 'Multi Shot',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=300&q=80',
    pricePerPiece: 4500,
    piecesPerCase: 1,
    availableCases: 35,
    minStockCases: 10,
  },
  {
    brand: 'Vadivel Pyrotechnics',
    name: 'Deepavali Family Gift Box',
    category: 'Gift Boxes',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
    pricePerPiece: 3800,
    piecesPerCase: 1,
    availableCases: 65,
    minStockCases: 15,
  },
];

const samplePurchases = [
  {
    purchaseId: 'PRF-101',
    billNo: '101',
    customer: 'SAI MOHAN MARKETING',
    customerName: 'SAI MOHAN MARKETING',
    companyName: 'SIMBA FW',
    date: '10-09-2026',
    subtotal: 307506.00,
    discount: 0,
    packing: 0,
    tax: 0,
    netTotal: 307506.00,
    debit: 307506.00,
    credit: 307500.00,
    netBalance: 6.00,
    status: 'Confirmed',
    items: [
      {
        particular: '20 SKY SHOT',
        caseCount: 10,
        rate: 2400,
        pktUnits: 10,
        totalUnits: 100,
        amount: 24000,
        rateMode: 'case',
      }
    ],
  },
  {
    purchaseId: 'PRF-102',
    billNo: '102',
    customer: 'SRI SAI TRADERS',
    customerName: 'SRI SAI TRADERS',
    companyName: 'STANDARD FIREWORKS',
    date: '12-09-2026',
    subtotal: 150000.00,
    discount: 0,
    packing: 0,
    tax: 0,
    netTotal: 150000.00,
    debit: 150000.00,
    credit: 150000.00,
    netBalance: 0.00,
    status: 'Confirmed',
    items: [],
  },
];

const sampleAdvances = [
  {
    customerId: 'CUST-101',
    customerName: 'SAI MOHAN MARKETING',
    companyName: 'SIMBA FW',
    creditAmt: 307500.00,
    amount: 307500.00,
    paymentMethod: 'UPI',
    paymentRefId: 'UPI-982341-Raipur',
    date: '10-09-2026',
    desc: 'Advance deposit payment',
  },
  {
    customerId: 'CUST-102',
    customerName: 'SRI SAI TRADERS',
    companyName: 'STANDARD FIREWORKS',
    creditAmt: 150000.00,
    amount: 150000.00,
    paymentMethod: 'Bank Transfer',
    paymentRefId: 'NEFT-55412-Sivakasi',
    date: '12-09-2026',
    desc: 'Advance credit payment',
  },
];

const sampleTransactions = [
  {
    date: '10-09-2026',
    productId: 'PROD-101',
    productName: 'Flower Pot (Deluxe)',
    brand: 'Standard Crackers',
    transactionType: 'Purchase Deduction',
    casesChanged: -10,
    piecesChanged: -100,
    reason: 'Confirmed Performo Bill PRF-101 for Customer SAI MOHAN MARKETING',
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stock-management';
    console.log(`📡 Connecting to MongoDB: ${mongoUri.split('@')[1] || mongoUri}...`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas cluster!');

    console.log('🧹 Cleaning existing collections...');
    await Customer.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await Purchase.deleteMany({});
    await AdvancePayment.deleteMany({});
    await StockTransaction.deleteMany({});

    console.log('🌱 Seeding Customers...');
    await Customer.insertMany(sampleCustomers);

    console.log('🌱 Seeding Brands...');
    await Brand.insertMany(sampleBrands.map((name) => ({ name })));

    console.log('🌱 Seeding Products...');
    await Product.insertMany(sampleProducts);

    console.log('🌱 Seeding Purchases / Performo Bills...');
    await Purchase.insertMany(samplePurchases);

    console.log('🌱 Seeding Advance Payments...');
    await AdvancePayment.insertMany(sampleAdvances);

    console.log('🌱 Seeding Stock Transactions...');
    await StockTransaction.insertMany(sampleTransactions);

    console.log('🎉 MongoDB Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();

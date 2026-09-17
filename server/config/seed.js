const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Purchase = require('../models/Purchase');
const AdvancePayment = require('../models/AdvancePayment');

const initialCustomers = [
  {
    customId: 'CUST-101',
    name: 'SAI MOHAN MARKETING',
    phone: '86020 05900',
    gst: '22ADWPN7742F1Z7',
    address: 'Plot No. 45, Commercial Complex, Raipur, Chhattisgarh - 492001',
    debit: 307506.00,
    credit: 307500.00,
  },
  {
    customId: 'CUST-102',
    name: 'SRI SAI TRADERS',
    phone: '98765 43210',
    gst: '33AAACR1234F1Z1',
    address: 'Main Market Road, Sivakasi, Tamil Nadu - 626123',
    debit: 150000.00,
    credit: 150000.00,
  },
  {
    customId: 'CUST-103',
    name: 'SHARMA CRACKERS STORE',
    phone: '98456 12370',
    gst: '27AABCS5678G2Z3',
    address: 'Station Road, Mumbai, Maharashtra - 400001',
    debit: 225000.00,
    credit: 200000.00,
  },
  {
    customId: 'CUST-104',
    name: 'MEENA STORES & FIREWORKS',
    phone: '91234 56790',
    gst: '36AAAFM9012H1Z5',
    address: 'Market Yard, Hyderabad, Telangana - 500001',
    debit: 85000.00,
    credit: 85000.00,
  },
];

const initialBrands = [
  'SIMBA FW',
  'Standard Crackers',
  'Ajanta Brand',
  'Sri Kaliswari Fireworks',
  'Coronation Fireworks',
  'Vadivel Pyrotechnics',
  'Ayyan Fireworks',
];

const initialProducts = [
  {
    brand: 'Standard Crackers',
    name: 'Flower Pot (Deluxe)',
    category: 'Flower Pots',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
    pricePerPiece: 2,
    piecesPerCase: 10,
    availableCases: 100,
    minStockCases: 15,
  },
  {
    brand: 'Standard Crackers',
    name: '10cm Electric Sparklers',
    category: 'Sparklers',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80',
    pricePerPiece: 12,
    piecesPerCase: 100,
    availableCases: 150,
    minStockCases: 20,
  },
  {
    brand: 'Ajanta Brand',
    name: 'Ground Chakkar (Big)',
    category: 'Ground Chakkars',
    image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80',
    pricePerPiece: 5,
    piecesPerCase: 20,
    availableCases: 80,
    minStockCases: 10,
  },
];

const seedDB = async () => {
  try {
    const custCount = await Customer.countDocuments();
    if (custCount === 0) {
      await Customer.insertMany(initialCustomers);
      console.log('🌱 Seeded default customers to MongoDB');
    }

    const brandCount = await Brand.countDocuments();
    if (brandCount === 0) {
      await Brand.insertMany(initialBrands.map((b) => ({ name: b })));
      console.log('🌱 Seeded default brands to MongoDB');
    }

    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      await Product.insertMany(initialProducts);
      console.log('🌱 Seeded default products to MongoDB');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

module.exports = seedDB;

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
    brand: 'SIMBA FW',
    companyName: 'SIMBA FW',
    name: '20 SKY SHOT',
    category: 'Aerial Shots',
    pricePerPiece: 240,
    rate: 240,
    piecesPerCase: 10,
    pktUnits: 10,
    availableCases: 100,
    cases: 100,
    minStockCases: 15,
  },
  {
    brand: 'Standard Crackers',
    companyName: 'Standard Crackers',
    name: '10cm Electric Sparklers',
    category: 'Sparklers',
    pricePerPiece: 120,
    rate: 120,
    piecesPerCase: 10,
    pktUnits: 10,
    availableCases: 150,
    cases: 150,
    minStockCases: 20,
  },
  {
    brand: 'SIMBA FW',
    companyName: 'SIMBA FW',
    name: 'Ground Chakkar Deluxe',
    category: 'Ground Chakkars',
    pricePerPiece: 180,
    rate: 180,
    piecesPerCase: 20,
    pktUnits: 20,
    availableCases: 120,
    cases: 120,
    minStockCases: 15,
  },
  {
    brand: 'SIMBA FW',
    companyName: 'SIMBA FW',
    name: 'Special Flower Pots',
    category: 'Flower Pots',
    pricePerPiece: 150,
    rate: 150,
    piecesPerCase: 10,
    pktUnits: 10,
    availableCases: 90,
    cases: 90,
    minStockCases: 10,
  },
  {
    brand: 'Coronation Fireworks',
    companyName: 'Coronation Fireworks',
    name: '30-Shot Multi Color Aerial',
    category: 'Aerial Shots',
    pricePerPiece: 450,
    rate: 450,
    piecesPerCase: 10,
    pktUnits: 10,
    availableCases: 50,
    cases: 50,
    minStockCases: 10,
  },
  {
    brand: 'Sri Kaliswari Fireworks',
    companyName: 'Sri Kaliswari Fireworks',
    name: 'Hydro Atom Bomb',
    category: 'Atom Bombs',
    pricePerPiece: 160,
    rate: 160,
    piecesPerCase: 10,
    pktUnits: 10,
    availableCases: 120,
    cases: 120,
    minStockCases: 25,
  },
  {
    brand: 'Ayyan Fireworks',
    companyName: 'Ayyan Fireworks',
    name: 'Whistling Rockets',
    category: 'Rockets',
    pricePerPiece: 210,
    rate: 210,
    piecesPerCase: 25,
    pktUnits: 25,
    availableCases: 80,
    cases: 80,
    minStockCases: 15,
  },
  {
    brand: 'Vadivel Pyrotechnics',
    companyName: 'Vadivel Pyrotechnics',
    name: 'Deepavali Family Gift Box',
    category: 'Gift Boxes',
    pricePerPiece: 380,
    rate: 380,
    piecesPerCase: 10,
    pktUnits: 10,
    availableCases: 65,
    cases: 65,
    minStockCases: 15,
  },
  {
    brand: 'Standard Crackers',
    companyName: 'Standard Crackers',
    name: 'Flower Pot (Deluxe)',
    category: 'Flower Pots',
    pricePerPiece: 240,
    rate: 240,
    piecesPerCase: 10,
    pktUnits: 10,
    availableCases: 100,
    cases: 100,
    minStockCases: 15,
  },
  {
    brand: 'Ajanta Brand',
    companyName: 'Ajanta Brand',
    name: 'Ground Chakkar (Big)',
    category: 'Ground Chakkars',
    pricePerPiece: 180,
    rate: 180,
    piecesPerCase: 20,
    pktUnits: 20,
    availableCases: 80,
    cases: 80,
    minStockCases: 10,
  },
  {
    brand: 'JOKER BRAND',
    companyName: 'JOKER BRAND',
    name: '120 shot',
    category: 'Aerial Shots',
    pricePerPiece: 350,
    rate: 350,
    piecesPerCase: 5,
    pktUnits: 5,
    availableCases: 50,
    cases: 50,
    minStockCases: 10,
  },
  {
    brand: 'VADIVEL',
    companyName: 'VADIVEL',
    name: 'Flower pot',
    category: 'Flower Pots',
    pricePerPiece: 140,
    rate: 140,
    piecesPerCase: 10,
    pktUnits: 10,
    availableCases: 60,
    cases: 60,
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

    // Ensure all standard products exist in Product collection
    const existingProducts = await Product.find({}).lean();
    for (const p of initialProducts) {
      const match = existingProducts.find(
        (ep) => (ep.name || '').trim().toLowerCase() === p.name.trim().toLowerCase()
      );
      if (!match) {
        await Product.create(p);
        console.log(`🌱 Added missing product to MongoDB: ${p.name}`);
      }
    }

    // Clean up any wrong / test records on startup
    await Purchase.deleteMany({ customerName: /General Customer/i });
    const Dispatch = require('../models/Dispatch');
    await Dispatch.deleteMany({ customerName: /General Customer/i });

    // Link customerId for purchases missing customerId
    const customers = await Customer.find({}).lean();
    const unlinkedPurchases = await Purchase.find({ customerId: { $in: [null, undefined, ''] } });
    for (const pur of unlinkedPurchases) {
      const cName = (pur.customerName || pur.customer || '').trim().toLowerCase();
      const matched = customers.find(c => (c.name || '').trim().toLowerCase() === cName);
      if (matched) {
        pur.customerId = matched.customId || matched._id.toString();
        await pur.save();
      }
    }
  } catch (err) {
    console.error('Seeding & Startup Sync error:', err.message);
  }
};

module.exports = seedDB;

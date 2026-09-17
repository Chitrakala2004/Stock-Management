const Product = require('../models/Product');

let memoryProducts = [
  {
    _id: 'PROD-101',
    id: 'PROD-101',
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
    _id: 'PROD-102',
    id: 'PROD-102',
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
    _id: 'PROD-103',
    id: 'PROD-103',
    brand: 'Ajanta Brand',
    name: 'Ground Chakkar (Big)',
    category: 'Ground Chakkars',
    image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80',
    pricePerPiece: 5,
    piecesPerCase: 20,
    availableCases: 80,
    minStockCases: 10,
  },
  {
    _id: 'PROD-104',
    id: 'PROD-104',
    brand: 'Ajanta Brand',
    name: 'Whistling Rockets',
    category: 'Rockets',
    image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=300&q=80',
    pricePerPiece: 15,
    piecesPerCase: 10,
    availableCases: 5,
    minStockCases: 15,
  },
  {
    _id: 'PROD-105',
    id: 'PROD-105',
    brand: 'Sri Kaliswari Fireworks',
    name: 'Hydro Atom Bomb',
    category: 'Atom Bombs',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80',
    pricePerPiece: 8,
    piecesPerCase: 50,
    availableCases: 120,
    minStockCases: 25,
  },
  {
    _id: 'PROD-106',
    id: 'PROD-106',
    brand: 'Coronation Fireworks',
    name: '30-Shot Multi Color Aerial',
    category: 'Multi Shot',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=300&q=80',
    pricePerPiece: 150,
    piecesPerCase: 1,
    availableCases: 3,
    minStockCases: 10,
  },
  {
    _id: 'PROD-107',
    id: 'PROD-107',
    brand: 'Vadivel Pyrotechnics',
    name: 'Deepavali Family Gift Box',
    category: 'Gift Boxes',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
    pricePerPiece: 380,
    piecesPerCase: 1,
    availableCases: 65,
    minStockCases: 15,
  },
];

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    if (products && products.length > 0) return res.status(200).json(products);
    return res.status(200).json(memoryProducts);
  } catch (error) {
    return res.status(200).json(memoryProducts);
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    return res.status(201).json(newProduct);
  } catch (error) {
    const newProduct = {
      _id: `PROD-${Date.now()}`,
      id: `PROD-${Date.now()}`,
      ...req.body,
    };
    memoryProducts.unshift(newProduct);
    return res.status(201).json(newProduct);
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updated) return res.status(200).json(updated);
  } catch (error) {
    // fallback
  }
  const idx = memoryProducts.findIndex(p => p._id === req.params.id || p.id === req.params.id);
  if (idx !== -1) {
    memoryProducts[idx] = { ...memoryProducts[idx], ...req.body };
    return res.status(200).json(memoryProducts[idx]);
  }
  res.status(404).json({ message: 'Product not found' });
};

const adjustStock = async (req, res) => {
  const { casesChange } = req.body;
  try {
    const prod = await Product.findById(req.params.id);
    if (prod) {
      prod.availableCases = Math.max(0, prod.availableCases + (parseInt(casesChange) || 0));
      await prod.save();
      return res.status(200).json(prod);
    }
  } catch (error) {
    // fallback
  }
  const idx = memoryProducts.findIndex(p => p._id === req.params.id || p.id === req.params.id);
  if (idx !== -1) {
    memoryProducts[idx].availableCases = Math.max(0, memoryProducts[idx].availableCases + (parseInt(casesChange) || 0));
    return res.status(200).json(memoryProducts[idx]);
  }
  res.status(404).json({ message: 'Product not found' });
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
  } catch (error) {
    // fallback
  }
  memoryProducts = memoryProducts.filter(p => p._id !== req.params.id && p.id !== req.params.id);
  res.status(200).json({ message: 'Product deleted' });
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
};

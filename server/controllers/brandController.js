const Brand = require('../models/Brand');

let memoryBrands = [
  'SIMBA FW',
  'Standard Crackers',
  'Ajanta Brand',
  'Sri Kaliswari Fireworks',
  'Coronation Fireworks',
  'Vadivel Pyrotechnics',
  'Ayyan Fireworks',
];

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    if (brands && brands.length > 0) {
      return res.status(200).json(brands.map(b => b.name));
    }
    return res.status(200).json(memoryBrands);
  } catch (error) {
    return res.status(200).json(memoryBrands);
  }
};

const createBrand = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Brand name required' });
  try {
    const newBrand = await Brand.create({ name });
    return res.status(201).json(newBrand);
  } catch (error) {
    if (!memoryBrands.includes(name)) {
      memoryBrands.push(name);
    }
    return res.status(201).json({ name });
  }
};

module.exports = {
  getBrands,
  createBrand,
};

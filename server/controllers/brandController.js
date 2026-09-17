const Brand = require('../models/Brand');
const mongoose = require('mongoose');

let memoryBrands = [
  { _id: '1', name: 'SIMBA FW', address: 'Sivakasi, Tamil Nadu - 626123', gst: '33AABCS1234L1Z5' },
  { _id: '2', name: 'Standard Crackers', address: 'Sivakasi, Tamil Nadu - 626189', gst: '33AABCS5678M2Z3' },
  { _id: '3', name: 'Ajanta Brand', address: 'Main Road, Sivakasi, Tamil Nadu - 626123', gst: '33AABCM9012N3Z1' },
  { _id: '4', name: 'Sri Kaliswari Fireworks', address: 'Industrial Estate, Sivakasi, Tamil Nadu - 626124', gst: '33AABCP3456O4Z9' },
  { _id: '5', name: 'Coronation Fireworks', address: 'Ring Road, Sivakasi, Tamil Nadu - 626123', gst: '33AABCM7890P5Z2' },
  { _id: '6', name: 'Vadivel Pyrotechnics', address: 'Vembakottai Road, Sivakasi, Tamil Nadu - 626131', gst: '33AABCA4321Q6Z8' },
  { _id: '7', name: 'Ayyan Fireworks', address: 'Sivakasi, Tamil Nadu - 626123', gst: '33AABCA1122Q3Z4' },
];

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    if (brands && brands.length > 0) {
      return res.status(200).json(brands);
    }
    return res.status(200).json(memoryBrands);
  } catch (error) {
    return res.status(200).json(memoryBrands);
  }
};

const createBrand = async (req, res) => {
  const { name, address, gst, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Brand name required' });
  try {
    const existing = await Brand.findOne({ name: name.trim() });
    if (existing) {
      return res.status(200).json(existing);
    }
    const newBrand = await Brand.create({
      name: name.trim(),
      address: address || 'Sivakasi, Tamil Nadu',
      gst: gst || 'N/A',
      description: description || '',
    });
    return res.status(201).json(newBrand);
  } catch (error) {
    console.error('Error creating brand:', error);
    const newBrand = {
      _id: `BRD-${Date.now()}`,
      name: name.trim(),
      address: address || 'Sivakasi, Tamil Nadu',
      gst: gst || 'N/A',
    };
    memoryBrands.unshift(newBrand);
    return res.status(201).json(newBrand);
  }
};

const updateBrand = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updated) return res.status(200).json(updated);
    }
    const updated = await Brand.findOneAndUpdate({ name: req.params.id }, req.body, { new: true });
    if (updated) return res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating brand:', error);
  }
  const idx = memoryBrands.findIndex(b => b._id === req.params.id || b.name === req.params.id);
  if (idx !== -1) {
    memoryBrands[idx] = { ...memoryBrands[idx], ...req.body };
    return res.status(200).json(memoryBrands[idx]);
  }
  res.status(404).json({ message: 'Brand not found' });
};

const deleteBrand = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Brand.findByIdAndDelete(req.params.id);
    } else {
      await Brand.findOneAndDelete({ name: req.params.id });
    }
    return res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
  }
  memoryBrands = memoryBrands.filter(b => b._id !== req.params.id && b.name !== req.params.id);
  res.status(200).json({ message: 'Brand deleted successfully' });
};

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};

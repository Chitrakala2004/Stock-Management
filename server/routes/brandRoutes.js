const express = require('express');
const router = express.Router();
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');

router.route('/')
  .get(getBrands)
  .post(createBrand);

router.route('/:id')
  .put(updateBrand)
  .delete(deleteBrand);

module.exports = router;

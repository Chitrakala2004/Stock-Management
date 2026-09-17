const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.route('/:id/stock')
  .put(adjustStock);

module.exports = router;

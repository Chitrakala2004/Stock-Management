const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStock,
  createStock,
  updateStock,
  deleteStock,
} = require('../controllers/stockController');

router.route('/').get(getStocks).post(createStock);
router.route('/:id').get(getStock).put(updateStock).delete(deleteStock);

module.exports = router;

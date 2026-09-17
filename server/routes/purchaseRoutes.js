const express = require('express');
const router = express.Router();
const {
  getPurchases,
  createPurchase,
  deletePurchase,
} = require('../controllers/purchaseController');

router.route('/')
  .get(getPurchases)
  .post(createPurchase);

router.route('/:id')
  .delete(deletePurchase);

module.exports = router;

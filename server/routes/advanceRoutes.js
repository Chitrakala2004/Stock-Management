const express = require('express');
const router = express.Router();
const {
  getAdvances,
  createAdvance,
  deleteAdvance,
} = require('../controllers/advanceController');

router.route('/')
  .get(getAdvances)
  .post(createAdvance);

router.route('/:id')
  .delete(deleteAdvance);

module.exports = router;

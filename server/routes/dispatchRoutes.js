const express = require('express');
const router = express.Router();
const {
  getDispatches,
  createDispatch,
  deleteDispatch,
} = require('../controllers/dispatchController');

router.route('/').get(getDispatches).post(createDispatch);
router.route('/:id').delete(deleteDispatch);

module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

router.post('/checkout', ensureAuthenticated, orderController.checkout);
router.get('/success', ensureAuthenticated, orderController.orderSuccess);

module.exports = router;
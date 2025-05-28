const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/cart/add", ensureAuthenticated, cartController.addToCart);

router.post("/cart/increase", ensureAuthenticated, cartController.increaseQuantity);

router.post("/cart/decrease", ensureAuthenticated, cartController.decreaseQuantity);

router.delete("/cart/delete/:id", ensureAuthenticated, cartController.deleteFromCart);

module.exports = router;
  
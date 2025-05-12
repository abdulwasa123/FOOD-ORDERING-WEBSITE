const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/cart/add", authMiddleware, cartController.addToCart);

router.post("/cart/increase", authMiddleware, cartController.increaseQuantity);

router.post("/cart/decrease", authMiddleware, cartController.decreaseQuantity);

router.delete("/cart/delete/:id", authMiddleware, cartController.deleteFromCart);


module.exports = router;
  
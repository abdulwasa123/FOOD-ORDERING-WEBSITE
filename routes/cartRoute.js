const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/add-to-cart", cartController.addToCart);

module.exports = router;
  
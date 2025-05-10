const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", foodController.renderHomePage);
router.get("/cart", foodController.renderCartPage);
router.get("/order", foodController.renderOrderPage);
router.get("/myOrders", foodController.rendermyOrdersPage);

router.get('/images/:id', foodController.getImages);

module.exports = router;
const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
  
router.get("/", foodController.renderHomePage);
router.get("/cart", ensureAuthenticated, foodController.renderCartPage);
router.get("/order", ensureAuthenticated, foodController.renderOrderPage);
router.get("/myOrders", ensureAuthenticated, foodController.rendermyOrdersPage);

router.get('/images/:id', foodController.getImages);

module.exports = router;
const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", foodController.renderHomePage);

module.exports = router;
const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const authMiddleware = require("../middleware/authMiddleware");

// router.get("/signup", registerController.renderRegisterPage);
router.post("/signup", registerController.registerUser);

module.exports = router;


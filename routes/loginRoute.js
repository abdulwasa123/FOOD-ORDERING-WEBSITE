const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

router.post("/login", loginController.loginUser);
router.get("/logout", ensureAuthenticated, loginController.logoutUser);

module.exports = router;
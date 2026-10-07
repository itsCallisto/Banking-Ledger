const express = require("express");
const authController = require("../controllers/auth.controller")
const router = express.Router();
router.post("/register",authController.regUser)
router.post("/login",authController.loginUser)
router.post("/logot",authController.logoutUser)
module.exports = router
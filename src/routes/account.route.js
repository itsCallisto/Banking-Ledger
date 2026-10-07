const express = require("express");
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")
const router = express.Router();
router.post("/",authMiddleware.authUser,accountController.createAccount)
router.get("/",authMiddleware.authUser,accountController.getAllaccount)
router.get("/balance/:accountId",authMiddleware.authUser,accountController.getAccountBalance)
module.exports = router



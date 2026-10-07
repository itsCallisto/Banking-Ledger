const express = require("express");
const authMiddleware = require("../middleware/auth.middleware")
const authSystemuser = require("../middleware/transaction.middleware")
const transactionController = require("../controllers/transaction.controller")

const router = express.Router();
router.post("/",authSystemuser.authSystem,transactionController.createTransaction)
router.post("/systemuser/initial-funds",authSystemuser.authSystem,transactionController.createInitialFundsTransaction)

module.exports = router
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");

const emailServices = require("../services/email.service");
const { default: mongoose } = require("mongoose");
const { ledgerModel } = require("../models/ledger.model");
const userModel = require("../models/user.model");
async function createTransaction(req, res) {
    const { fromAccount, toAccount, status, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "info incomplete"
        })
    }
    console.log("toAccount received:", toAccount);
    console.log("type:", typeof toAccount);
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })
    const ToUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    console.log("receiver account:", toUserAccount);
    if (!fromUserAccount || !ToUserAccount) {
        return res.status(400).json({
            messgae: "Invalid fromAccount or toAccount"
        })
    }
    const isTransactionExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    });
    if (isTransactionExists) {
        if (isTransactionExists.status == "COMPLETED") {
            return res.status(200).json({
                message: "Transaction completed",
                transaction: isTransactionExists
            })
        }
        else if (isTransactionExists.status == "PENDING") {
            return res.status(200).json({
                message: "Transaction is pending"
            })
        }
        else if (isTransactionExists.status == "FAILED") {
            return res.status(500).json({
                message: "Transaction is failed"
            })
        }
        else if (isTransactionExists.status == "REVERSED") {
            return res.status(500).json({
                message: "Transaction is reversed , plz try later"
            })
        }
    }

    if (fromUserAccount.status != "ACTIVE" || ToUserAccount.status != "ACTIVE") {
        return res.status(400).json({
            message: "Both account should be active"
        })
    }

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Your account balance is ${balance} and the requested amount is ${amount}`
        })
    }
    try {
        const session = await mongoose.startSession()
        session.startTransaction()

        const transaction = (await transactionModel([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",

        }], { session }))[0]

        ledgerModel.create(
            [{
                account: fromAccount,
                amount,
                transaction: transaction._id,
                type: "DEBIT"
            }],
            { session }
        )
        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()
    }
    catch (err) {
        return res.status(400).json({
            message: "Transaction is pending due to some reason plz try again after sometime"
        })
    }

    // await emailServices.sendTransactionEmail(req.user.email, req.user.name, amaount, toAccount)
    res.status(201).json({
        message: "Transaction completed successfully"
    })

}

async function createInitialFundsTransaction(req, res) {
    console.log("🔥 createInitialFundsTransaction called");
    console.log("BODY:", req.body);
    console.log("AUTH USER:", req.user);
    const user = req.user;
    const { toAccount, amount, idempotencyKey } = req.body;
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount,amount and idempotencyKey required"
        })
    }
    if (!req.user.systemUser) {
        return res.status(403).json({
            message: "Only system user can perform this operation"
        });
    }
    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })
    console.log("TO ACCOUNT ID:", toAccount);
    console.log("TO ACCOUNT FOUND:", toUserAccount);
    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid receiver"
        })
    }
    const fromUserAccount = await accountModel.findOne({

        user: user._id,
        status: "ACTIVE"
    })
    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }
    console.log("SYSTEM USER:", user._id);
    console.log("FROM ACCOUNT:", fromUserAccount._id);
    console.log("FROM ACCOUNT OWNER:", fromUserAccount.user);

    console.log("TO ACCOUNT:", toUserAccount._id);
    console.log("TO ACCOUNT OWNER:", toUserAccount.user);
    const session = await mongoose.startSession()
    session.startTransaction()
    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",

    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })
    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })


}





module.exports = { createTransaction, createInitialFundsTransaction }
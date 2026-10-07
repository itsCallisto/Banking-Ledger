const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
async function createAccount(req, res) {
    const user = req.user;
    const account = await accountModel.create({
        user: user._id
    })
    res.status(201).json({
        message: "Account is being created",
        account
    })
}

async function getAllaccount(req, res) {
    const user = req.user;
    const account = await accountModel.findOne({
        user: user._id
    }

    );
    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }
    res.status(200).json({
        account: user
    })
}
async function getAccountBalance(req, res) {
    const { accountId } = req.params;
    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    });
    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }
    const balance = await account.getBalance();
    res.status(200).json({
        account: account._id,
        balance: balance
    })

}

module.exports = { createAccount, getAllaccount, getAccountBalance }
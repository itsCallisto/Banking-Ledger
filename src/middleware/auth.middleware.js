const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model")
const tokenModel = require("../models/tokenBlacklisted.model")
async function authUser(req, res, next) {

    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }
    const isTokenBlacklisted = await tokenModel.findOne({token});
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Unauthorized user, token invalid"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT);
        const user = await userModel.findById(decoded.userId);
        req.user = user;
        return next()
    }
    catch (err) {
        console.log(err);
        res.status(401).json({
            message: "Unauthorized access"
        })
    }


}
module.exports = {authUser}
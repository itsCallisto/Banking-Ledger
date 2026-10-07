const userModel = require("../models/user.model");
const tokenModel = require("../models/tokenBlacklisted.model")
const jwt = require("jsonwebtoken");
const emailServices = require("../services/email.service")
async function regUser(req,res){
    const {name,email,password} = req.body;
    const isEmailAlreadyExists = await userModel.findOne({email});
    if(isEmailAlreadyExists){
        return res.status(422).json({
            message:"Email Already Exists",
            status:"failed"
        })
    }
    const user = await userModel.create({
        name,email,password
    })
    const token = jwt.sign({
        userId:user._id
    },process.env.JWT,{expiresIn:"3D"})
    res.cookie("token",token)
    res.status(201).json({
        message:"User registered successfully",
        id:user._id,
        username:user.name,
        email:user.email,
        password:user.password
    })

    // await emailServices.sendRegistrationEmail(user.email,user.name)

    
}

async function loginUser(req,res){
    const {name,email,password} = req.body;
    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }
    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
        return res.status(401).json({
            message:"email or password is invalid"
        })
    }
     const token = jwt.sign({
        userId:user._id
    },process.env.JWT,{expiresIn:"3D"})
    res.cookie("token",token)
    res.status(200).json({
        message:"User registered successfully",
        id:user._id,
        username:user.name,
        email:user.email,
        password:user.password
    })
    
}


async function logoutUser(req,res){
    const token = req.cookie.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(200).json({
            message:"User logged out successfully"
        })
    }
    
    await tokenModel.create({token:token})
    res.clearCookie("token");

    res.status(200).json({
        message:"User logged out successfully"
    })
}
module.exports = {regUser,loginUser,logoutUser}
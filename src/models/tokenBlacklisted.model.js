const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    blackeListedat:{
        type:Date,
        default:Date.now,
        immutable:true
    }
},
{
    timestamps:true
})

tokenSchema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3
})

const tokenModel = mongoose.model("tokenBlacklist",tokenSchema);

module.exports = tokenModel;
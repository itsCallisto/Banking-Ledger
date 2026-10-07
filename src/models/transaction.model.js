const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Source should be given"],
        index:true
    },
    toAccount:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Destination should be given"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status can be either be PENDING,COMPLETED,FAILED OR REVERSED"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:[0,"Amount can't be negative"],
    },
    idempotencyKey:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
},
{
    timestamps:true
});

const transactionModel = mongoose.model("transaction",transactionSchema);

module.exports = transactionModel;

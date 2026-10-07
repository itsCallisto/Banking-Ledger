const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,],
        requied: [true, "eamil is required"]

    },
    name: {
        type: String,
        required: [true, "Name is required for creating an account"],

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should contain more than 6 characters"],
        select: false
    },
    systemUser:{
        type:Boolean,
        select:false,
        default:false,
        immutable:true
    }

},
    {
        timestamps: true

    });

userSchema.pre("save",async function (){
    if(!this.isModified("password")){
        return
    }
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
    
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password);
}

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;




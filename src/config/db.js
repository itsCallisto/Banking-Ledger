const mongoose = require("mongoose");
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB sucessfully...")
    }
    catch(err){
        console.log(err)
    }
   
}

module.exports = connectDB;
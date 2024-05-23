const mongoose = require("mongoose")

//db configuration
const configDB = async()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/BlinkitReplica")
        console.log('Successfull DB Connection')
    }catch(err){
        console.log('Error in DB Connection')
    }
}

module.exports = configDB;
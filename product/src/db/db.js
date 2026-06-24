const mongoose = require('mongoose')

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODBURL)
        .then(()=>{
            console.log("db connected successfully")
        })
        
    } catch (error) {
        return "Couldn't connect to DB"
    }
}

module.exports = connectDb
    
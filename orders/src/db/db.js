const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODBURL)
            .then(() => {
                console.log("connected to db")
            })
    }catch(err){
        console.log(err,"error occured")
    }
}

module.exports = connectDb
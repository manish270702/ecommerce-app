const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    pincode:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    addresstype:{
        type:String,
        enum:["Home","Office"],
        required:true
    },
    isDefaultaddresstype:{
        type:Boolean,
        default:false,
        required:true
    }
})

module.exports = mongoose.model("Addess",addressSchema)
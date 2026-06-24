const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required: true
    },
    images:[{type:String}],
    price:{
        type:Number,
        required:true
    },
    discountPercentage:{
        type:Number
    },
    createdBy:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    sold:{
        type:Number,
        required:true,
        default:0
    },
    isActive:{
        type:Boolean,
        required:true,
        default:true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Product", productSchema)
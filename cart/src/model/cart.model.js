const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    items: [
        {
            productid: {
                type: mongoose.Schema.Types.ObjectId,
                require: true
            },
            quantity:{
                type:Number,
                require:true,
                default:1,
                min:1
            },
            price:{
                type:Number,
                require:true
            }
        }
    ]
},{
    timestamps :true
})

module.exports = mongoose.model("cart",cartSchema)
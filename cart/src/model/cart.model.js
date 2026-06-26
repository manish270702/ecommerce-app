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
                default:1
            }
        }
    ]
},{
    timestamps :true
})

module.exports = mongoose.model("cart",cartSchema)
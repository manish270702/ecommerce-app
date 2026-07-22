const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [
        {
            productid: {
                type: mongoose.Schema.Types.ObjectId,
                require: true
            },
            quantity: {
                type: Number,
                require: true,
                default: 0,
                min: 1
            },
            price: {
                type: Number,
                require: true
            },
            stock: {
                type: Number,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model("cart", cartSchema)
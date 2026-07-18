const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    avatar: {
        type: String,
        default: ""
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

    address: {
        pincode: {
            type: String,
            // required: true
        },
        state: {
            type: String,
            // required: true
        },
        city: {
            type: String,
            // required: true
        },
        area: {
            type: String,
            // required: true
        },
        landmark: {
            type: String,
            // required: true
        },
        addresstype: {
            type: String,
            enum: ["Home", "Office"],
            // required: true
        },
        isDefaultaddresstype: {
            type: Boolean,
            default: false,
            // required: true
        }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)
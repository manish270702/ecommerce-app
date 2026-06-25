const express = require("express")
const router = express.Router()

const {getCartItems,createCart} = require("../controllers/cart.controllers")
const validate = require("../middlewares/checklogin.middleware")

router.get("/",
    validate,
    getCartItems
)
router.post("/",
    validate,
    createCart
)

module.exports = router
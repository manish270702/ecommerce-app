const express = require("express")
const router = express.Router()

const {getCartItems} = require("../controllers/cart.controllers")
const validate = require("../middlewares/checklogin.middleware")

router.get("/",validate,getCartItems)

module.exports = router
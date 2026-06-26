const express = require("express")
const { getorders,createOrder } = require("../controller/order.controllers")
const {validate} = require("../middlewares/checklogin.middleware")
const router = express.Router()

router.get(
"/",
validate,
getorders
)

router.post(
    "/",
    validate,
    createOrder
)

module.exports = router
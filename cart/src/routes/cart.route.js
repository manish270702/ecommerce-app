const express = require("express")
const router = express.Router()

const { getCartItems, createCart, removeproduct, deleteCart } = require("../controllers/cart.controllers")
const validate = require("../middlewares/checklogin.middleware")

router.get("/",
    validate,
    getCartItems
)
router.post("/",
    validate,
    createCart
)
router.delete("/",
    validate,
    deleteCart
)
router.delete("/:id",
    validate,
    removeproduct
)

module.exports = router
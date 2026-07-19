const express = require('express')
const { createProduct, deleteProduct,getProducts } = require('../controllers/Product.controller')
const upload = require('../middlewares/upload.middleware')
const validate_admin = require('../middlewares/checkadmin.middleware')

const router = express.Router()

router.get("/",
    getProducts
)
router.post("/createProduct",
    validate_admin,
    upload.array("images", 5),
    createProduct
)

router.delete("/product/:id",
    validate_admin,
    deleteProduct
)


module.exports = router
const express = require('express')
const { createProduct, delete_product } = require('../controllers/Product.controller')
const upload = require('../middlewares/upload.middleware')
const validate_login = require('../middlewares/checklogin.middleware')
const buy = require('../controllers/buy.controller')

const router = express.Router()

router.post("/buy",
    validate_login,
    buy
)


module.exports = router
const express = require('express')
const { category, delete_category, get_categories } = require('../controllers/category.controller')
const upload = require('../middlewares/upload.middleware')
const validate_admin = require('../middlewares/checkadmin.middleware')

const router = express.Router()

router.get("/allCategory", get_categories)

router.post("/createCategory",
    validate_admin,
    upload.single("image"),
    category
)

router.delete("/category/:id",
    validate_admin,
    delete_category
)

module.exports = router
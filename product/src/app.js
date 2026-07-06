require("dotenv").config()
const express = require('express')
const productRoutes = require("./routes/product.routes")
const categoryRoutes = require("./routes/category.routes")
const connectDb = require("./db/db")
const cookieparser = require("cookie-parser")
const limiter = require("./services/Limiter")
const app = express()
connectDb()

app.use(limiter)
app.use(cookieparser())
app.use(express.json())

app.use("/", productRoutes)
app.use("/", categoryRoutes)


module.exports = app
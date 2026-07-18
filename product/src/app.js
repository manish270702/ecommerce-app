require("dotenv").config()
const express = require('express')
const cors = require("cors")
const productRoutes = require("./routes/product.routes")
const categoryRoutes = require("./routes/category.routes")
const connectDb = require("./db/db")
const cookieparser = require("cookie-parser")
const limiter = require("./services/Limiter")
const app = express()
connectDb()

app.use(cookieparser())
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true               
}));
app.use(limiter)

app.use("/api/products", productRoutes)
app.use("/api/category", categoryRoutes)



module.exports = app
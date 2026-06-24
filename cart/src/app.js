require("dotenv").config()

const express = require("express")
const connectToDb = require("./db/db")
const cookieparser = require("cookie-parser")
const cors = require("cors")
const cartRoutes = require("./routes/cart.route")

const app = express()
connectToDb()

app.use("/cart",cartRoutes)

module.exports = app
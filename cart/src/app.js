require("dotenv").config()

const express = require("express")
const connectToDb = require("./db/db")
const cookieparser = require("cookie-parser")
const cors = require("cors")
const cartRoutes = require("./routes/cart.route")

const app = express()
app.use(cookieparser())
app.use(express.json());
connectToDb()

app.use("/cart",cartRoutes)

console.log(process.env.PORT)

module.exports = app
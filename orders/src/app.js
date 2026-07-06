require("dotenv").config()
const express = require("express")
const connectDb = require("./db/db")
const cookieparser = require("cookie-parser")
const orderRoute = require("./routes/order.route")
const Limiter = require("./services/Limiter")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(Limiter)

app.use("/orders",orderRoute)

connectDb()

module.exports  = app
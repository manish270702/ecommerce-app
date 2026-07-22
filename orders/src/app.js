require("dotenv").config()
const express = require("express")
const connectDb = require("./db/db")
const cookieparser = require("cookie-parser")
const orderRoute = require("./routes/order.route")
const Limiter = require("./services/Limiter")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(Limiter)

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true               
}));

connectDb()

app.use("/api/orders",orderRoute)

// return order routes and apis are missing 


module.exports  = app
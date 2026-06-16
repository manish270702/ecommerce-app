require("dotenv").config()

const express = require("express")
const connectToDb = require("./db/db")
const cookieparser = require("cookie-parser")
const cors = require("cors")

const app = express()
connectToDb()

module.exports = app
const express = require("express")
require('dotenv').config();
const connectDb = require("./db/db")
const AuthRoutes = require("./routes/auth.route")
const cookieparser = require("cookie-parser")
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const limiter = require("./services/Limiter")
const app = express()
const cors =require("cors")

app.use(cookieparser())
app.use(passport.initialize());

app.use(express.json())
app.use(limiter)

app.use(cors({
    origin: "http://localhost:5173", // Your exact frontend URL
    credentials: true                // Required to match withCredentials
}));

connectDb()

app.use("/api/auth", AuthRoutes);

// user Routes are missing here 
// create update address controller
// create a profile update controller using multer and imagekit

module.exports = app
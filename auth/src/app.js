const express = require("express")
require('dotenv').config();
const connectDb = require("./db/db")
const AuthRoutes = require("./routes/auth.route")
const cookieparser = require("cookie-parser")
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const limiter = require("./services/Limiter")
const app = express()

app.use(passport.initialize());

app.use(cookieparser())
app.use(express.json())
app.use(limiter)

connectDb()

app.use("/api/auth", AuthRoutes);

// user Routes are missing here 
// create update address controller
// create a profile update controller using multer and imagekit

module.exports = app
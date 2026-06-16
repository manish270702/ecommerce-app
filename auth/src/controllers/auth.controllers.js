const usermodel = require('../models/user.model')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {

    const { name, email, phone, password, confirmPassword } = req.body

    if (password != confirmPassword) {
        return res.status(409).json({
            message: "Password doesn't match"
        })

    }


    const isExisting = await usermodel.findOne({ email })

    const hashedpassword = await bcrypt.hash(password, 10);

    if (isExisting) {
        return res.status(409).json({
            message: "user already exists with this email"
        })
    }

    const user = await usermodel.create({ name, email, phone, password: hashedpassword })

    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );


    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })


    res.status(200).json({
        message: "user created",
        user,
        accessToken
    })
}


const login = async (req, res) => {
    const { loginId, password } = req.body

    const user = await usermodel.findOne({
        $or: [
            { email: loginId },
            { phone: loginId }
        ]
    })

    console.log(user)

    const verifyPassword = await bcrypt.compare(password, user.password)

    if (!user || !verifyPassword) {
        return res.status(409).json({
            message: "something went wrong"
        })
    }

    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );


    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "user logined successfully",
        user,
        accessToken
    })


}


const refreshToken = async (req, res) => {

    const refreshtoken = req.cookies.token
    const decoded = await jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET)

    console.log(decoded)

    const user = await usermodel.findOne({ _id: decoded.id })

    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );


    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "token refreshed successfully",
        user,
        accessToken
    })


}


const admin = async (req, res) => {

    const { name, email, phone, password, confirmPassword } = req.body

    if (password != confirmPassword) {
        return res.status(409).json({
            message: "Password doesn't match"
        })

    }


    const isExisting = await usermodel.findOne({ email })

    const hashedpassword = await bcrypt.hash(password, 10);

    if (isExisting) {
        return res.status(409).json({
            message: "user already exists with this email"
        })
    }

    const user = await usermodel.create({ name, email, phone,role:"admin", password: hashedpassword })

    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );


    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })


    res.status(200).json({
        message: "user created",
        user,
        accessToken
    })
}


module.exports = { register, login, refreshToken,admin }
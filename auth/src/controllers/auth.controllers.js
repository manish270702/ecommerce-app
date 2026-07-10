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

    console.log(refreshToken)


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

    // console.log(user)
    if (!user) {
        return res.status(409).json({
            message: "invalid crednetials"
        })
    }

    const verifyPassword = await bcrypt.compare(password, user.password)

    if (!verifyPassword) {
        return res.status(409).json({
            message: "invalid crednetials"
        })
    }

    const safeUser = await usermodel.findById(user._id).select("-password");

    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
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

    console.log(refreshToken)

    res.status(200).json({
        message: "user logined successfully",
        user: safeUser,
        accessToken
    })


}


const refreshUserToken = async (req, res) => {
    try {
        // 1. Check if the token cookie exists
        const tokenFromCookie = req.cookies?.token;
        
        if (!tokenFromCookie) {
            return res.status(401).json({ message: "Refresh token missing" });
        }

        // 2. Verify the refresh token safely
        const decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET);

        // 3. Find the user and verify they still exist
        const user = await usermodel.findOne({ _id: decoded.id });
        if (!user) {
            return res.status(404).json({ message: "User no longer exists" });
        }

        // 4. Generate a new Access Token
        const newAccessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        // 5. Generate a new Refresh Token (Fixes variable name collision)
        const newRefreshToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // 6. Set the updated cookie
        res.cookie("token", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Flips to false during local development
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // 7. Return sanitized response (Do not leak the password hash)
        return res.status(200).json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            user
        });

    } catch (error) {
        // Catch expired or tampered tokens safely
        console.error("Refresh token error:", error.message);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};


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

    const user = await usermodel.create({ name, email, phone, role: "admin", password: hashedpassword })

    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
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


const me = async (req, res) => {
    if (req.user) {
        return res.status(200).json({ user: req.user })
    }

    const refreshToken = req.cookies?.token
    if (!refreshToken) {
        return res.status(401).json({ message: 'unauthorized' })
    }

    try {
        const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await usermodel.findOne({ _id: decoded.id })
        if (!user) return res.status(404).json({ message: 'user not found' })
        return res.status(200).json({ user })
    } catch (err) {
        return res.status(401).json({ message: 'unauthorized' })
    }
}

const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    })
    return res.status(200).json({ message: 'logged out successfully' })
}

module.exports = { register, login, refreshUserToken, admin, me, logout }

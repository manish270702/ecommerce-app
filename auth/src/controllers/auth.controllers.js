const usermodel = require('../models/user.model')
const axios = require('axios');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const transporter = require("../services/email.service")
const otpmodel = require("../models/otp.model")

const mailcontroller = async (req, res) => {
    const { email, name } = req.body
    try {
        const otp = Math.floor(1000 + Math.random() * 9000)

        const otpalreadyExists = await otpmodel.findOne({ email })

        if (otpalreadyExists) {
            return res.json({
                success: true,
                message: "Email already sent successfully"
            });
        }

        await otpmodel.create({ email, otp })

        await transporter.sendMail({
            from: "my602382@gmail.com",
            to: email,
            subject: "Your OTP for ecommerce app",
            html: `
                <h2>Hello ${name}!</h2>
                <p>This email was sent using Resend <b>${otp}</b>.</p>
            `
        });

        return res.json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error,
            message: "Failed to send email"
        });
    }
}

const register = async (req, res) => {
    try {



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

        const emailres = await axios.post("http://localhost:3000/api/auth/test-email", {
            email, name
        });


        // console.log(emailres)

        res.cookie("token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // console.log(refreshToken)


        return res.status(200).json({
            message: "user created",
            user,
            accessToken,
            emailStatus: emailres.data.success
        });

    } catch (error) {
        console.log(error)
    }
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

    const emailres = await axios.post("http://localhost:3000/api/auth/test-email", {
        email: user.email, name: user.name
    });

    // console.log(safeUser.email)
    res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // console.log(refreshToken)

    res.status(200).json({
        message: "user logined successfully",
        user: safeUser,
        accessToken,
        emailStatus: emailres.data.success
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

const updateUser = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await usermodel.findOneAndUpdate(
            { _id: id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await usermodel.findByIdAndUpdate(
            id,
            {
                address: req.body.address,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            message: "Address updated successfully",
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
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

const verifyotp = async (req, res) => {
    const { otp, email } = req.body

    // console.log(typeof(otp))

    const user = await otpmodel.findOne({
        email
    })

    // console.log(email)

    if (!user) return res.status(404).json({ message: "no such user" })
    // console.log(user)

    if (user.otp == otp) {
        return res.status(200).json({ message: "login successful" })
    } else {
        return res.status(404).json({ message: "invalid otp" })
    }

}

module.exports = { register, login, verifyotp, refreshUserToken, admin, me, logout, updateUser, updateAddress, mailcontroller }

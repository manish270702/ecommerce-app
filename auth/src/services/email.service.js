const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "my602382@gmail.com",
        pass: "rjnp cfbk yhmg xaym"
    }
});

module.exports = transporter
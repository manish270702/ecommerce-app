const jwt = require('jsonwebtoken');

const validate = async (req, res,next) => {
    try {
        const token = req.cookies.token;

        // console.log(token)

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );


        req.user = {
            id: decoded.id
        };
        // console.log(req.user.id)

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = {validate};
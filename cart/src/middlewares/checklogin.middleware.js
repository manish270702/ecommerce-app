const jwt = require('jsonwebtoken');

const validate = async (req, res, next) => {
    try {
        const token
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
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

module.exports = validate;
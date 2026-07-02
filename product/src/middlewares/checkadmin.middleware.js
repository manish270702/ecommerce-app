const jwt = require('jsonwebtoken');

const validate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (decoded.role == "user") {
            return res.status(401).json({
                message: "unauthorize user"
            });
        }

        req.user = {
            id: decoded.id
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = validate;
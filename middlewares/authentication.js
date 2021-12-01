require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY_JWT;


module.exports = async (req, res, next) => {
    const bearerToken = req.header("Authorization");
    try {
        const token = bearerToken.replace("Bearer ", "");
        const decoded = jwt.verify(token, secretKey);

        req.users = decoded;
        const users = req.users;

        if (!users) {
            return res.status(400).json({
                status: "failed",
                message: "Authorization denied! please login",
                data: null,
            });
        }
        next();

    } catch (error) {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized, invalid token!",
        });
    }
};

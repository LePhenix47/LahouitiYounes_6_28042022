const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = verifiedToken.userId;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid User ID";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error } | "Unathentificated request");
    }
};
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err };
    }
}

module.exports = { generateToken, verifyToken };
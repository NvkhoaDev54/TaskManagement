require('dotenv').config();
const express = require("express");
const api_token_middleware = express.Router();


if (!process.env.API_TOKEN) {
    throw new Error("Missing API_TOKEN in .env");
}


// Middleware to check for API token in headers
api_token_middleware.use((req, res, next) => {
    const apiToken = req.headers['x-api-token'];
    if (!apiToken) {
        return res.status(400).json({
            success: false,
            msg: "Missing API Token"
        });
    }

    if (apiToken !== process.env.API_TOKEN) {
        return res.status(401).json({
            success: false,
            msg: "Unauthorized: Invalid API Token"
        });
    }
    next();
});

module.exports = api_token_middleware;
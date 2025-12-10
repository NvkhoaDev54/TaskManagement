// routes/AuthRouter.js
const express = require('express');
const router = express.Router();

// Import controller
const authController = require('../controllers/auth');

// Import validation middleware
const { validateRegister, validateLogin } = require('../middlewares/validation');

// Auth routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

module.exports = router;

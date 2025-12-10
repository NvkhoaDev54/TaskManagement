// routes/UserRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/authcompare');
const { validateUserUpdate } = require('../middlewares/validation');

// Public routes - không cần authentication
router.get('/search', userController.searchUsers);
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUser);

// Protected routes - cần authentication
router.use(authMiddleware);
router.put('/me', validateUserUpdate, userController.updateMe);
router.delete('/me', userController.deleteMe);

module.exports = router;
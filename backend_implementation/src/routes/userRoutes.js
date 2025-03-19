const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticateUser, userController.getProfile);
router.put('/profile', authenticateUser, userController.updateProfile);
router.get('/saved-books', authenticateUser, userController.getSavedBooks);
router.post('/saved-books/:bookId', authenticateUser, userController.saveBook);
router.delete('/saved-books/:bookId', authenticateUser, userController.removeSavedBook);

module.exports = router;

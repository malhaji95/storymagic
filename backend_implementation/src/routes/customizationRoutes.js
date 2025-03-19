const express = require('express');
const router = express.Router();
const customizationController = require('../controllers/customizationController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public routes
router.get('/:id', customizationController.getCustomizationById);

// Protected routes
router.post('/', authenticateUser, customizationController.createCustomization);
router.put('/:id', authenticateUser, customizationController.updateCustomization);
router.delete('/:id', authenticateUser, customizationController.deleteCustomization);
router.get('/user/all', authenticateUser, customizationController.getUserCustomizations);
router.post('/:id/generate-book', authenticateUser, customizationController.generateCustomizedBook);
router.get('/options/:type', customizationController.getCustomizationOptions);

module.exports = router;

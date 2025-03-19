const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public routes
router.get('/', storyController.getAllStories);
router.get('/filter', storyController.filterStories);
router.get('/:id', storyController.getStoryById);
router.get('/:id/elements', storyController.getStoryElements);

// Protected routes
router.post('/', authenticateUser, storyController.createStory);
router.put('/:id', authenticateUser, storyController.updateStory);
router.delete('/:id', authenticateUser, storyController.deleteStory);

module.exports = router;

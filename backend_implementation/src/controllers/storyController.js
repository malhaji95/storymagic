const { Story, StoryElement } = require('../models');
const { Op } = require('sequelize');

// Get all stories
exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.findAll({
      attributes: ['id', 'title', 'description', 'cover_image', 'min_age', 'max_age', 'gender']
    });
    
    res.json(stories);
  } catch (error) {
    console.error('Error in getAllStories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Filter stories by criteria
exports.filterStories = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    
    const whereClause = {};
    
    if (gender && gender !== 'all') {
      whereClause.gender = {
        [Op.or]: [gender, 'neutral']
      };
    }
    
    if (minAge && maxAge) {
      whereClause[Op.and] = [
        { min_age: { [Op.lte]: parseInt(maxAge) } },
        { max_age: { [Op.gte]: parseInt(minAge) } }
      ];
    } else if (minAge) {
      whereClause.max_age = { [Op.gte]: parseInt(minAge) };
    } else if (maxAge) {
      whereClause.min_age = { [Op.lte]: parseInt(maxAge) };
    }
    
    const stories = await Story.findAll({
      where: whereClause,
      attributes: ['id', 'title', 'description', 'cover_image', 'min_age', 'max_age', 'gender']
    });
    
    res.json(stories);
  } catch (error) {
    console.error('Error in filterStories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get story by ID
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const story = await Story.findByPk(id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.json(story);
  } catch (error) {
    console.error('Error in getStoryById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get story elements
exports.getStoryElements = async (req, res) => {
  try {
    const { id } = req.params;
    
    const elements = await StoryElement.findAll({
      where: { story_id: id },
      order: [['position', 'ASC']]
    });
    
    res.json(elements);
  } catch (error) {
    console.error('Error in getStoryElements:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new story (admin only)
exports.createStory = async (req, res) => {
  try {
    const { title, description, baseContent, coverImage, minAge, maxAge, gender, elements } = req.body;
    
    // Create story
    const story = await Story.create({
      title,
      description,
      base_content: baseContent,
      cover_image: coverImage,
      min_age: minAge,
      max_age: maxAge,
      gender
    });
    
    // Create story elements if provided
    if (elements && Array.isArray(elements)) {
      const storyElements = elements.map(element => ({
        ...element,
        story_id: story.id
      }));
      
      await StoryElement.bulkCreate(storyElements);
    }
    
    res.status(201).json(story);
  } catch (error) {
    console.error('Error in createStory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a story (admin only)
exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, baseContent, coverImage, minAge, maxAge, gender } = req.body;
    
    const story = await Story.findByPk(id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Update fields
    if (title) story.title = title;
    if (description) story.description = description;
    if (baseContent) story.base_content = baseContent;
    if (coverImage) story.cover_image = coverImage;
    if (minAge) story.min_age = minAge;
    if (maxAge) story.max_age = maxAge;
    if (gender) story.gender = gender;
    
    await story.save();
    
    res.json(story);
  } catch (error) {
    console.error('Error in updateStory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a story (admin only)
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Story.destroy({
      where: { id }
    });
    
    if (result === 0) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error in deleteStory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

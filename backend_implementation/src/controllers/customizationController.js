const { Customization, CustomizedBook, CustomizationOption, Story } = require('../models');

// Get customization by ID
exports.getCustomizationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const customization = await Customization.findByPk(id, {
      include: [{ model: Story, attributes: ['title', 'description', 'cover_image'] }]
    });
    
    if (!customization) {
      return res.status(404).json({ message: 'Customization not found' });
    }
    
    res.json(customization);
  } catch (error) {
    console.error('Error in getCustomizationById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new customization
exports.createCustomization = async (req, res) => {
  try {
    const { storyId, name, gender, age, customFields } = req.body;
    
    // Check if story exists
    const story = await Story.findByPk(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Create customization
    const customization = await Customization.create({
      user_id: req.user.id,
      story_id: storyId,
      name,
      gender,
      age,
      custom_fields: customFields || {}
    });
    
    res.status(201).json(customization);
  } catch (error) {
    console.error('Error in createCustomization:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a customization
exports.updateCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, age, customFields } = req.body;
    
    const customization = await Customization.findOne({
      where: { id, user_id: req.user.id }
    });
    
    if (!customization) {
      return res.status(404).json({ message: 'Customization not found' });
    }
    
    // Update fields
    if (name) customization.name = name;
    if (gender) customization.gender = gender;
    if (age) customization.age = age;
    if (customFields) customization.custom_fields = customFields;
    
    await customization.save();
    
    res.json(customization);
  } catch (error) {
    console.error('Error in updateCustomization:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a customization
exports.deleteCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Customization.destroy({
      where: { id, user_id: req.user.id }
    });
    
    if (result === 0) {
      return res.status(404).json({ message: 'Customization not found' });
    }
    
    res.json({ message: 'Customization deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCustomization:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all customizations for a user
exports.getUserCustomizations = async (req, res) => {
  try {
    const customizations = await Customization.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Story, attributes: ['title', 'description', 'cover_image'] }]
    });
    
    res.json(customizations);
  } catch (error) {
    console.error('Error in getUserCustomizations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate a customized book from a customization
exports.generateCustomizedBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the customization
    const customization = await Customization.findOne({
      where: { id, user_id: req.user.id },
      include: [{ model: Story }]
    });
    
    if (!customization) {
      return res.status(404).json({ message: 'Customization not found' });
    }
    
    // Generate the customized content
    const story = customization.Story;
    const baseContent = story.base_content;
    
    // Apply customizations to the content
    const renderedContent = applyCustomizationsToContent(baseContent, customization);
    
    // Generate a customized cover image path (in a real app, this would create an actual image)
    const coverImage = `/covers/customized/${customization.id}_${Date.now()}.jpg`;
    
    // Create or update the customized book
    let customizedBook = await CustomizedBook.findOne({
      where: { customization_id: customization.id }
    });
    
    if (customizedBook) {
      customizedBook.rendered_content = renderedContent;
      customizedBook.cover_image = coverImage;
      customizedBook.status = 'final';
      await customizedBook.save();
    } else {
      customizedBook = await CustomizedBook.create({
        customization_id: customization.id,
        rendered_content: renderedContent,
        cover_image: coverImage,
        status: 'final'
      });
    }
    
    res.json(customizedBook);
  } catch (error) {
    console.error('Error in generateCustomizedBook:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get customization options by type
exports.getCustomizationOptions = async (req, res) => {
  try {
    const { type } = req.params;
    
    const options = await CustomizationOption.findAll({
      where: { element_type: type },
      order: [['display_order', 'ASC']]
    });
    
    res.json(options);
  } catch (error) {
    console.error('Error in getCustomizationOptions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to apply customizations to content
const applyCustomizationsToContent = (baseContent, customization) => {
  // Deep clone the base content
  const renderedContent = JSON.parse(JSON.stringify(baseContent));
  
  // Apply name customization
  if (renderedContent.pages) {
    renderedContent.pages = renderedContent.pages.map(page => {
      if (page.text) {
        page.text = page.text.replace(/{{name}}/g, customization.name);
      }
      return page;
    });
  }
  
  // Apply other customizations from custom_fields
  if (customization.custom_fields) {
    Object.entries(customization.custom_fields).forEach(([key, value]) => {
      if (renderedContent.pages) {
        renderedContent.pages = renderedContent.pages.map(page => {
          if (page.text) {
            page.text = page.text.replace(new RegExp(`{{${key}}}`, 'g'), value);
          }
          return page;
        });
      }
    });
  }
  
  return renderedContent;
};

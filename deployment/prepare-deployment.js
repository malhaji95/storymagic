const path = require('path');
const fs = require('fs');

// Copy all necessary files from the frontend implementation to the deployment directory
const copyFrontendFiles = () => {
  const sourceDir = path.join(__dirname, '..', 'frontend_implementation');
  const targetDir = path.join(__dirname, 'frontend', 'src');
  
  // Create target directories if they don't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy components, pages, styles, and other directories
  const dirsToCopy = ['components', 'pages', 'styles', 'hooks', 'context', 'utils', 'api'];
  
  dirsToCopy.forEach(dir => {
    const sourcePath = path.join(sourceDir, 'src', dir);
    const targetPath = path.join(targetDir, dir);
    
    if (fs.existsSync(sourcePath)) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      
      // Copy all files in the directory
      const files = fs.readdirSync(sourcePath);
      files.forEach(file => {
        const sourceFile = path.join(sourcePath, file);
        const targetFile = path.join(targetPath, file);
        
        if (fs.statSync(sourceFile).isFile()) {
          fs.copyFileSync(sourceFile, targetFile);
          console.log(`Copied ${sourceFile} to ${targetFile}`);
        }
      });
    }
  });
  
  // Copy public directory
  const sourcePublic = path.join(sourceDir, 'public');
  const targetPublic = path.join(targetDir, '..', 'public');
  
  if (fs.existsSync(sourcePublic)) {
    if (!fs.existsSync(targetPublic)) {
      fs.mkdirSync(targetPublic, { recursive: true });
    }
    
    const files = fs.readdirSync(sourcePublic);
    files.forEach(file => {
      const sourceFile = path.join(sourcePublic, file);
      const targetFile = path.join(targetPublic, file);
      
      if (fs.statSync(sourceFile).isFile()) {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`Copied ${sourceFile} to ${targetFile}`);
      }
    });
  }
  
  console.log('Frontend files copied successfully!');
};

// Copy all necessary files from the backend implementation to the deployment directory
const copyBackendFiles = () => {
  const sourceDir = path.join(__dirname, '..', 'backend_implementation');
  const targetDir = path.join(__dirname, 'backend', 'src');
  
  // Create target directories if they don't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy controllers, models, routes, services, utils, and middleware directories
  const dirsToCopy = ['controllers', 'models', 'routes', 'services', 'utils', 'middleware'];
  
  dirsToCopy.forEach(dir => {
    const sourcePath = path.join(sourceDir, 'src', dir);
    const targetPath = path.join(targetDir, dir);
    
    if (fs.existsSync(sourcePath)) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      
      // Copy all files in the directory
      const files = fs.readdirSync(sourcePath);
      files.forEach(file => {
        const sourceFile = path.join(sourcePath, file);
        const targetFile = path.join(targetPath, file);
        
        if (fs.statSync(sourceFile).isFile()) {
          fs.copyFileSync(sourceFile, targetFile);
          console.log(`Copied ${sourceFile} to ${targetFile}`);
        }
      });
    }
  });
  
  // Copy config directory
  const sourceConfig = path.join(sourceDir, 'config');
  const targetConfig = path.join(targetDir, '..', 'config');
  
  if (fs.existsSync(sourceConfig)) {
    if (!fs.existsSync(targetConfig)) {
      fs.mkdirSync(targetConfig, { recursive: true });
    }
    
    const files = fs.readdirSync(sourceConfig);
    files.forEach(file => {
      const sourceFile = path.join(sourceConfig, file);
      const targetFile = path.join(targetConfig, file);
      
      if (fs.statSync(sourceFile).isFile()) {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`Copied ${sourceFile} to ${targetFile}`);
      }
    });
  }
  
  // Copy app.js to the root of the backend deployment directory
  const sourceApp = path.join(sourceDir, 'src', 'app.js');
  const targetApp = path.join(targetDir, '..', 'app.js');
  
  if (fs.existsSync(sourceApp)) {
    fs.copyFileSync(sourceApp, targetApp);
    console.log(`Copied ${sourceApp} to ${targetApp}`);
  }
  
  console.log('Backend files copied successfully!');
};

// Create database initialization and seed scripts
const createDatabaseScripts = () => {
  const scriptsDir = path.join(__dirname, 'backend', 'scripts');
  
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
  
  // Create initDb.js
  const initDbContent = `
const { sequelize } = require('../src/models');

const initDb = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDb();
`;
  
  fs.writeFileSync(path.join(scriptsDir, 'initDb.js'), initDbContent);
  console.log('Created initDb.js script');
  
  // Create migrate.js
  const migrateContent = `
const { sequelize } = require('../src/models');

const migrate = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error migrating database:', error);
    process.exit(1);
  }
};

migrate();
`;
  
  fs.writeFileSync(path.join(scriptsDir, 'migrate.js'), migrateContent);
  console.log('Created migrate.js script');
  
  // Create seed.js
  const seedContent = `
const { User, Story, StoryElement, CharacterTemplate, CustomizationOption } = require('../src/models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      email: 'admin@storymagic.com',
      password_hash: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin'
    });
    
    // Create sample stories
    const story1 = await Story.create({
      title: 'Adventure in the Forest',
      description: 'Join your child on an exciting adventure through an enchanted forest!',
      base_content: JSON.stringify({
        pages: [
          { page_number: 1, text: 'This is the story of {{name}}.' },
          { page_number: 2, text: '{{name}} went on an adventure in the magical forest.' },
          { page_number: 3, text: '{{name}} met a friendly {{favoriteAnimal}} who became their guide.' },
          { page_number: 4, text: 'Together they discovered a hidden treasure!' },
          { page_number: 5, text: '{{name}} returned home, excited to share their adventure with everyone.' }
        ]
      }),
      cover_image: '/books/forest-adventure.jpg',
      min_age: 4,
      max_age: 8,
      gender: 'neutral'
    });
    
    const story2 = await Story.create({
      title: 'Space Explorer',
      description: 'Blast off into space with your child as they discover planets and stars!',
      base_content: JSON.stringify({
        pages: [
          { page_number: 1, text: '{{name}} dreamed of exploring space.' },
          { page_number: 2, text: 'One night, a spaceship landed in {{name}}\\'s backyard.' },
          { page_number: 3, text: '{{name}} boarded the spaceship and flew to the stars.' },
          { page_number: 4, text: 'They visited planets of all colors, including {{favoriteColor}} ones.' },
          { page_number: 5, text: '{{name}} returned home with amazing stories of their space adventure.' }
        ]
      }),
      cover_image: '/books/space-explorer.jpg',
      min_age: 6,
      max_age: 10,
      gender: 'boy'
    });
    
    const story3 = await Story.create({
      title: 'Princess of the Kingdom',
      description: 'Your child becomes the princess of a magical kingdom!',
      base_content: JSON.stringify({
        pages: [
          { page_number: 1, text: 'Once upon a time, there was a princess named {{name}}.' },
          { page_number: 2, text: 'Princess {{name}} lived in a beautiful castle with {{favoriteColor}} towers.' },
          { page_number: 3, text: 'She had a pet {{favoriteAnimal}} who was her loyal companion.' },
          { page_number: 4, text: 'Together they went on many adventures throughout the kingdom.' },
          { page_number: 5, text: 'Princess {{name}} was loved by all and ruled the kingdom with kindness.' }
        ]
      }),
      cover_image: '/books/princess-kingdom.jpg',
      min_age: 4,
      max_age: 8,
      gender: 'girl'
    });
    
    // Create story elements
    await StoryElement.bulkCreate([
      { story_id: story1.id, element_type: 'character', position: 1, customizable: true, default_value: 'Hero' },
      { story_id: story1.id, element_type: 'animal', position: 2, customizable: true, default_value: 'fox' },
      { story_id: story2.id, element_type: 'character', position: 1, customizable: true, default_value: 'Explorer' },
      { story_id: story2.id, element_type: 'color', position: 2, customizable: true, default_value: 'blue' },
      { story_id: story3.id, element_type: 'character', position: 1, customizable: true, default_value: 'Princess' },
      { story_id: story3.id, element_type: 'color', position: 2, customizable: true, default_value: 'pink' },
      { story_id: story3.id, element_type: 'animal', position: 3, customizable: true, default_value: 'unicorn' }
    ]);
    
    // Create character templates
    await CharacterTemplate.bulkCreate([
      { gender: 'boy', age_group: '4-6', base_image: '/characters/boy-4-6.png', customizable_features: JSON.stringify({ hair: ['blonde', 'brown', 'black'], skin: ['light', 'medium', 'dark'] }) },
      { gender: 'boy', age_group: '7-10', base_image: '/characters/boy-7-10.png', customizable_features: JSON.stringify({ hair: ['blonde', 'brown', 'black'], skin: ['light', 'medium', 'dark'] }) },
      { gender: 'girl', age_group: '4-6', base_image: '/characters/girl-4-6.png', customizable_features: JSON.stringify({ hair: ['blonde', 'brown', 'black', 'red'], skin: ['light', 'medium', 'dark'] }) },
      { gender: 'girl', age_group: '7-10', base_image: '/characters/girl-7-10.png', customizable_features: JSON.stringify({ hair: ['blonde', 'brown', 'black', 'red'], skin: ['light', 'medium', 'dark'] }) }
    ]);
    
    // Create customization options
    await CustomizationOption.bulkCreate([
      { element_type: 'hair', option_name: 'Blonde', option_value: 'blonde', display_order: 1 },
      { element_type: 'hair', option_name: 'Brown', option_value: 'brown', display_order: 2 },
      { element_type: 'hair', option_name: 'Black', option_value: 'black', display_order: 3 },
      { element_type: 'hair', option_name: 'Red', option_value: 'red', display_order: 4 },
      { element_type: 'skin', option_name: 'Light', option_value: 'light', display_order: 1 },
      { element_type: 'skin', option_name: 'Medium', option_value: 'medium', display_order: 2 },
      { element_type: 'skin', option_name: 'Dark', option_value: 'dark', display_order: 3 },
      { element_type: 'animal', option_name: 'Dog', option_value: 'dog', display_order: 1 },
      { element_type: 'animal', option_name: 'Cat', option_value: 'cat', display_order: 2 },
      { element_type: 'animal', option_name: 'Rabbit', option_value: 'rabbit', display_order: 3 },
      { element_type: 'animal', option_name: 'Fox', option_value: 'fox', display_order: 4 },
      { element_type: 'animal', option_name: 'Unicorn', option_value: 'unicorn', display_order: 5 },
      { element_type: 'color', option_name: 'Red', option_value: 'red', display_order: 1 },
      { element_type: 'color', option_name: 'Blue', option_value: 'blue', display_order: 2 },
      { element_type: 'color', option_name: 'Green', option_value: 'green', display_order: 3 },
      { element_type: 'color', option_name: 'Purple', option_value: 'purple', display_order: 4 },
      { element_type: 'color', option_name: 'Pink', option_value: 'pink', display_order: 5 },
      { element_type: 'color', option_name: 'Yellow', option_value: 'yellow', display_order: 6 }
    ]);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
`;
  
  fs.writeFileSync(path.join(scriptsDir, 'seed.js'), seedContent);
  console.log('Created seed.js script');
};

// Main function to prepare deployment files
const prepareDeployment = () => {
  try {
    copyFrontendFiles();
    copyBackendFiles();
    createDatabaseScripts();
    console.log('Deployment preparation completed successfully!');
  } catch (error) {
    console.error('Error preparing deployment:', error);
  }
};

// Execute the preparation
prepareDeployment();

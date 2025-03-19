require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Log the current directory for debugging
console.log('Current Directory:', __dirname);

// Import models from the correct path
const models = require('./src/models'); // Ensure models are being imported from the correct relative path
const { sequelize } = require('./src/models'); // Import sequelize if it's part of your models file
const userRoutes = require('./src/routes/userRoutes');
const storyRoutes = require('./src/routes/storyRoutes');
const customizationRoutes = require('./src/routes/customizationRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const errorMiddleware = require('./src/middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/customizations', customizationRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate(); // Ensure sequelize is correctly connected
    console.log('Database connection established successfully.');
    
    // Sync database models (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized.');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

module.exports = app; // For testing purposes

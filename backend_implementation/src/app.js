const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');

// Import middleware and routes
const { sequelize } = require('./src/models'); // Updated path
const userRoutes = require('./src/routes/userRoutes'); // Updated path
const storyRoutes = require('./src/routes/storyRoutes'); // Updated path
const customizationRoutes = require('./src/routes/customizationRoutes'); // Updated path
const orderRoutes = require('./src/routes/orderRoutes'); // Updated path
const errorMiddleware = require('./src/middleware/errorMiddleware'); // Updated path

const app = express();
const PORT = process.env.PORT || 5000;

// Production security and optimization middleware
app.use(helmet());
app.use(compression());

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://storymagic-platform.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory inside 'src'
app.use(express.static(path.join(__dirname, 'src/public')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/customizations', customizationRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorMiddleware);

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // For testing purposes

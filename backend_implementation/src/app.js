const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');

// Log the current directory and files for debugging
console.log('Current directory:', __dirname);
console.log('Files in current directory:', fs.readdirSync(__dirname));

// Try to find the models directory
const possibleModelPaths = [
  './models',
  './src/models',
  '../src/models',
  path.join(__dirname, 'models'),
  path.join(__dirname, 'src', 'models'),
  path.join(__dirname, '..', 'src', 'models')
];

let modelsPath;
for (const p of possibleModelPaths) {
  try {
    fs.accessSync(p);
    modelsPath = p;
    console.log('Found models at:', p);
    break;
  } catch (e) {
    console.log('Models not found at:', p);
  }
}

if (!modelsPath) {
  console.error('Could not find models directory');
  process.exit(1);
}

// Simple version without database for initial testing
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

app.use(cors(corsOptions) );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Simple API routes for testing
app.get('/api/stories', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Adventure in the Forest',
      description: 'Join your child on an exciting adventure through an enchanted forest!',
      coverImage: '/books/forest-adventure.jpg',
      minAge: 4,
      maxAge: 8,
      gender: 'neutral'
    },
    {
      id: 2,
      title: 'Space Explorer',
      description: 'Blast off into space with your child as they discover planets and stars!',
      coverImage: '/books/space-explorer.jpg',
      minAge: 6,
      maxAge: 10,
      gender: 'boy'
    },
    {
      id: 3,
      title: 'Princess of the Kingdom',
      description: 'Your child becomes the princess of a magical kingdom!',
      coverImage: '/books/princess-kingdom.jpg',
      minAge: 4,
      maxAge: 8,
      gender: 'girl'
    }
  ]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

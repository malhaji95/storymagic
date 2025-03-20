const express = require('express');
const cors = require('cors');
const path = require('path');

// Create a simple Express app without any database dependencies
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log the environment for debugging
console.log('Current directory:', __dirname);
console.log('Environment variables:', process.env);
console.log('Files in current directory:', require('fs').readdirSync(__dirname));

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

// Get a specific story by ID
app.get('/api/stories/:id', (req, res) => {
  const storyId = parseInt(req.params.id);
  const stories = [
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
  ];
  
  const story = stories.find(s => s.id === storyId);
  
  if (story) {
    res.json(story);
  } else {
    res.status(404).json({ message: 'Story not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

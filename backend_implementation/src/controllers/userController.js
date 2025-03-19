const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CustomizedBook, UserSavedBook } = require('../models');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      token
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      token
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (firstName) user.first_name = firstName;
    if (lastName) user.last_name = lastName;
    if (email) user.email = email;

    await user.save();

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's saved books
exports.getSavedBooks = async (req, res) => {
  try {
    const savedBooks = await UserSavedBook.findAll({
      where: { user_id: req.user.id },
      include: [{ model: CustomizedBook }]
    });

    res.json(savedBooks);
  } catch (error) {
    console.error('Error in getSavedBooks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save a book
exports.saveBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    // Check if book exists
    const book = await CustomizedBook.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if already saved
    const existingSave = await UserSavedBook.findOne({
      where: {
        user_id: req.user.id,
        customized_book_id: bookId
      }
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Book already saved' });
    }

    // Save book
    const savedBook = await UserSavedBook.create({
      user_id: req.user.id,
      customized_book_id: bookId
    });

    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error in saveBook:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove a saved book
exports.removeSavedBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const result = await UserSavedBook.destroy({
      where: {
        user_id: req.user.id,
        customized_book_id: bookId
      }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Saved book not found' });
    }

    res.json({ message: 'Book removed from saved books' });
  } catch (error) {
    console.error('Error in removeSavedBook:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    
    // Check if user exists
    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    const user = new User({ name, username, email, password });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name, username, email, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error changing password' });
  }
};

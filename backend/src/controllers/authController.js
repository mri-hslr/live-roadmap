const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'devsecret';

/**
 * For simplicity: this demo uses a lightweight "login" that creates a user if not exists.
 * In production use proper password hashing and email flows.
 */
async function login(req, res) {
  const { name, role } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  let user = await User.findOne({ name });
  if (!user) {
    user = new User({ name, role: role || 'editor', avatarColor: '#'+Math.floor(Math.random()*16777215).toString(16) });
    await user.save();
  }
  const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, secret, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.role, avatarColor: user.avatarColor } });
}

module.exports = { login };

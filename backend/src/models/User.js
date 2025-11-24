const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  passwordHash: { type: String }, // for demo you can store plain if needed (but use bcrypt in prod)
  role: { type: String, enum: ['viewer','editor','admin'], default: 'editor' },
  avatarColor: { type: String, default: '#3498db' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

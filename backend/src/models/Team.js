const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacityPoints: { type: Number, default: 100 }
});

module.exports = mongoose.model('Team', teamSchema);

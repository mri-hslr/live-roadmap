const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  tasks: { type: Array } // store a copy of tasks (denormalized)
});

module.exports = mongoose.model('RoadmapSnapshot', snapshotSchema);

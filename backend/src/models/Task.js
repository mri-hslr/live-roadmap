const mongoose = require('mongoose');
const { Schema } = mongoose;

/*
 Task = roadmap item
 fields:
  - content: title
  - start, end : ISO strings (dates)
  - team: string or ref
  - dependsOn: array of Task._id
  - points: capacity points required
  - version: integer for optimistic concurrency
  - meta: status, assignee, description
*/
const taskSchema = new Schema({
  content: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  team: { type: String, default: 'Unassigned' },
  dependsOn: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  points: { type: Number, default: 10 },
  version: { type: Number, default: 1 },
  status: { type: String, enum: ['todo','in-progress','done'], default: 'todo' },
  assignee: { type: String, default: null },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

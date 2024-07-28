import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: 'low',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Task', TaskSchema);
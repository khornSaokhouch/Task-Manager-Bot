const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    default: '' 
  },

  // Priority level for urgency tracking
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },

  // Task progress state
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], 
    default: 'Pending' 
  },

  // Reference to assigned member
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    default: null 
  },

  // Optional group/project association
  groupId: { 
    type: String, 
    default: null 
  },

  // Optional file attachments (URLs or file IDs)
  attachments: [String],

  // Labels/tags to categorize tasks
  tags: [String],

  // Subtasks that link to other Task documents
  subtasks: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
  ],

  // Recurrence settings
  recurring: { type: Boolean, default: false },
  recurrencePattern: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', null], 
    default: null 
  },

  // Timing fields
  deadline: { 
    type: Date, 
    required: true 
  },
  completedAt: { 
    type: Date, 
    default: null 
  },

  // Analytics: when and by whom created
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },

  // Gamification & progress tracking
  pointsAwarded: { 
    type: Number, 
    default: 0 
  },
  commentsCount: { 
    type: Number, 
    default: 0 
  }
});

// Update timestamp automatically
taskSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Virtual property for overdue detection
taskSchema.virtual('isOverdue').get(function () {
  return this.deadline && this.status !== 'Completed' && new Date() > this.deadline;
});

module.exports = mongoose.model('Task', taskSchema);

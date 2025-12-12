const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    default: ''
  },
  action_type: {
    type: String,
    required: true,
    enum: ['view', 'create', 'update', 'delete', 'login', 'logout', 'search', 
           'export', 'print', 'download', 'upload', 'approve', 'reject', 'submit'],
    index: true
  },
  page_path: {
    type: String,
    required: true,
    index: true
  },
  page_name: {
    type: String,
    default: ''
  },
  activity_description: {
    type: String,
    default: ''
  },
  duration_seconds: {
    type: Number,
    default: 0
  },
  ip_address: {
    type: String,
    default: ''
  },
  user_agent: {
    type: String,
    default: ''
  },
  referrer: {
    type: String,
    default: ''
  },
  additional_data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true // จะสร้าง createdAt และ updatedAt อัตโนมัติ
});

// Create indexes for better query performance
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user_id: 1, createdAt: -1 });
activityLogSchema.index({ action_type: 1, createdAt: -1 });
activityLogSchema.index({ page_path: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
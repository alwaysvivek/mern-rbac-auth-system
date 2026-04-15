const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'],
    },
    entity: {
      type: String,
      required: true,
      default: 'User', // Expandable to other entities
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Capture diffs or metadata
    },
  },
  {
    timestamps: true,
  }
);

// Prevent modifications (Immutable audit log)
auditLogSchema.pre('updateOne', function (next) {
  next(new Error('Audit logs are immutable'));
});

auditLogSchema.pre('findOneAndUpdate', function (next) {
  next(new Error('Audit logs are immutable'));
});

auditLogSchema.pre('remove', function (next) {
  next(new Error('Audit logs are immutable'));
});

module.exports = mongoose.model('AuditLog', auditLogSchema);

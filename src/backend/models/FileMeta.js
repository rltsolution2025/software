const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: String,
  filename: String,   // stored filename on disk
  mimetype: String,
  size: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  path: String,       // optional: folder or selectedItem from sidebar
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileMeta', fileSchema);

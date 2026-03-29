const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema({
    institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
    name: { type: String, required: true },
    location: String
}, { timestamps: true });

// Ensure unique campus name within institution
campusSchema.index({ institution: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Campus', campusSchema);

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    quota: { type: String, required: true },
    academicYear: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

counterSchema.index({ program: 1, quota: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Counter', counterSchema);

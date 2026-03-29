const mongoose = require('mongoose');

const deptSchema = new mongoose.Schema({
    campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
    name: { type: String, required: true },
    code: { type: String, required: true }
}, { timestamps: true });

deptSchema.index({ campus: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Department', deptSchema);

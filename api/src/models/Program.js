const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    name: { type: String, required: true },
    academicYear: { type: String, required: true }, // e.g., 2026
    courseType: { type: String, enum: ['UG', 'PG'], required: true },
    intake: { type: Number, required: true },
    quotas: [{
        name: { type: String, enum: ['KCET', 'COMEDK', 'Management'], required: true },
        total: { type: Number, required: true },
        filled: { type: Number, default: 0 }
    }],
    supernumerary: [{
        name: { type: String, required: true },
        total: { type: Number, required: true },
        filled: { type: Number, default: 0 }
    }],
}, { timestamps: true });

// Helper to check quota availability
programSchema.methods.hasQuotaAvailable = function (quotaName, isSupernumerary = false) {
    const collection = isSupernumerary ? this.supernumerary : this.quotas;
    const quota = collection.find(q => q.name === quotaName);
    return quota && (quota.filled < quota.total);
};

programSchema.index({ department: 1, name: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Program', programSchema);

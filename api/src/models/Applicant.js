const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    category: { type: String, required: true },
    entryType: { type: String, enum: ['Regular', 'Lateral'], default: 'Regular' },
    quota: { type: String, enum: ['KCET', 'COMEDK', 'Management'], required: true },
    admissionMode: { type: String, enum: ['Government', 'Management'], required: true },
    allotmentNumber: { type: String },
    marksPercentage: { type: Number, required: true },
    docStatus: {
        type: String,
        enum: ['Pending', 'Submitted', 'Verified'],
        default: 'Pending'
    },
    feeStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['Draft', 'Allocated', 'Confirmed'],
        default: 'Draft'
    },
    admissionNumber: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Applicant', applicantSchema);

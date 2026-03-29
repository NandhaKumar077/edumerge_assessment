const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true, unique: true, index: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true, unique: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    academicYear: { type: String, required: true },
    courseType: { type: String, required: true },
    quota: { type: String, required: true },
    entryType: { type: String, required: true },
    admissionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);

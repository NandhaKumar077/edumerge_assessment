const Applicant = require('../models/Applicant');
const Program = require('../models/Program');
const Admission = require('../models/Admission');
const Counter = require('../models/Counter');

// Seat Allocation
exports.allocateSeat = async (req, res) => {
    try {
        const { applicantId, programId, quota: quotaName } = req.body;

        // Find program with Institution data
        const program = await Program.findById(programId).populate({
            path: 'department',
            populate: { path: 'campus', populate: { path: 'institution' } }
        });
        if (!program) return res.status(404).json({ error: 'Program not found' });

        // Check availability
        let quota = program.quotas.find(q => q.name === quotaName);
        let isSuper = false;

        if (!quota) {
            // Check if it exists in supernumerary
            quota = program.supernumerary.find(s => s.name === quotaName);
            if (!quota) return res.status(400).json({ error: 'Invalid Quota' });
            isSuper = true;
        }

        if (quota.filled >= quota.total) {
            return res.status(400).json({ error: `Quota ${quotaName} is full (${quota.total}/${quota.total} seats filled)` });
        }

        // Global Institution Cap check for Supernumerary (if applicable)
        if (isSuper) {
            const inst = program.department.campus.institution;
            const globalCap = inst.supernumeraryCaps.find(c => c.name === quotaName);
            if (globalCap && globalCap.filled >= globalCap.total) {
                return res.status(400).json({ error: `Global Institutional cap for ${quotaName} is full (${globalCap.total} seats reached)` });
            }
            if (globalCap) globalCap.filled += 1;
            await inst.save();
        }

        // Check applicant
        const applicant = await Applicant.findById(applicantId);
        if (!applicant) return res.status(404).json({ error: 'Applicant not found' });

        if (applicant.status !== 'Draft') {
            return res.status(400).json({ error: `Applicant already in ${applicant.status} state` });
        }

        // Lock the seat
        quota.filled += 1;
        await program.save();

        // Update Applicant Status
        applicant.status = 'Allocated';
        applicant.program = programId;
        applicant.quota = quotaName;
        await applicant.save();

        res.json({ message: 'Seat allocated successfully', applicant });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admission Confirmation
exports.confirmAdmission = async (req, res) => {
    try {
        const { applicantId } = req.body;

        // Find Applicant with Populated Program/Department/Campus/Institution
        const applicant = await Applicant.findById(applicantId).populate({
            path: 'program',
            populate: {
                path: 'department',
                populate: { path: 'campus', populate: { path: 'institution' } }
            }
        });

        if (!applicant) return res.status(404).json({ error: 'Applicant not found' });

        // Rule: Only allocate if Fee = Paid
        if (applicant.feeStatus !== 'Paid') {
            return res.status(400).json({ error: 'Admission cannot be confirmed unless Fee is Paid' });
        }

        if (applicant.status === 'Confirmed') {
            return res.status(400).json({ error: 'Applicant already confirmed' });
        }

        // Generate Admission Number
        // INST/2026/UG/CSE/KCET/0001
        const instCode = applicant.program.department.campus.institution.code || 'INST';
        const year = applicant.program.academicYear;
        const type = applicant.program.courseType;
        const progCode = applicant.program.department.code;
        const quota = applicant.quota;

        // Sequence handling
        const counter = await Counter.findOneAndUpdate(
            { program: applicant.program._id, quota: quota, academicYear: year },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const seqNum = counter.seq.toString().padStart(4, '0');
        const admissionNumber = `${instCode}/${year}/${type}/${progCode}/${quota}/${seqNum}`;

        // Record Admission
        const newAdmission = await Admission.create({
            admissionNumber,
            applicant: applicant._id,
            program: applicant.program._id,
            academicYear: year,
            courseType: type,
            quota: quota,
            entryType: applicant.entryType
        });

        // Update Applicant
        applicant.status = 'Confirmed';
        applicant.admissionNumber = admissionNumber;
        await applicant.save();

        res.json({ message: 'Admission confirmed successfully', admissionNumber, admission: newAdmission });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getConfirmedAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find().populate('applicant');
        res.json(admissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

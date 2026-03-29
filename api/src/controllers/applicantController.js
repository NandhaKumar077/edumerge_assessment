const Applicant = require('../models/Applicant');
const logger = require('../utils/logger');

exports.createApplicant = async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;
        logger.info(`Received registration request: ${firstName} ${lastName}`, 'Applicant');

        // Check duplicate email
        const existing = await Applicant.findOne({ email });
        if (existing) {
            logger.warn(`Duplicate email blocked: ${email}`, 'Applicant');
            return res.status(400).json({ error: 'Email already exists' });
        }

        const applicant = await Applicant.create(req.body);
        logger.info(`Success! New applicant ID: ${applicant._id}`, 'Applicant');
        res.status(201).json(applicant);
    } catch (err) {
        logger.error(`Registration Failed`, 'Applicant', err);
        res.status(400).json({ error: err.message });
    }
};

exports.getApplicants = async (req, res) => {
    try {
        const query = {};
        if (req.query.status) query.status = req.query.status;
        if (req.query.feeStatus) query.feeStatus = req.query.feeStatus;
        if (req.query.docStatus) query.docStatus = req.query.docStatus;

        const applicants = await Applicant.find(query).populate({
            path: 'program',
            populate: {
                path: 'department',
                populate: { path: 'campus', populate: { path: 'institution' } }
            }
        });
        res.json(applicants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDocStatus = async (req, res) => {
    try {
        const applicant = await Applicant.findByIdAndUpdate(req.params.id,
            { docStatus: req.body.status }, { new: true });
        res.json(applicant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateFeeStatus = async (req, res) => {
    try {
        const applicant = await Applicant.findByIdAndUpdate(req.params.id,
            { feeStatus: req.body.status }, { new: true });
        res.json(applicant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

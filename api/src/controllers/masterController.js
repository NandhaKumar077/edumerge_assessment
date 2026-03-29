const Institution = require('../models/Institution');
const Campus = require('../models/Campus');
const Department = require('../models/Department');
const Program = require('../models/Program');

// Institutions
exports.createInstitution = async (req, res) => {
    try {
        const inst = await Institution.create(req.body);
        res.status(201).json(inst);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getInstitutions = async (req, res) => {
    try {
        const insts = await Institution.find();
        res.json(insts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Campuses
exports.createCampus = async (req, res) => {
    try {
        const campus = await Campus.create(req.body);
        res.status(201).json(campus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getCampuses = async (req, res) => {
    try {
        const query = req.query.institution ? { institution: req.query.institution } : {};
        const campuses = await Campus.find(query).populate('institution');
        res.json(campuses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Departments
exports.createDepartment = async (req, res) => {
    try {
        const dept = await Department.create(req.body);
        res.status(201).json(dept);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getDepartments = async (req, res) => {
    try {
        const query = req.query.campus ? { campus: req.query.campus } : {};
        const depts = await Department.find(query).populate({
            path: 'campus',
            populate: { path: 'institution' }
        });
        res.json(depts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Programs
exports.createProgram = async (req, res) => {
    try {
        const { intake, quotas } = req.body;
        // Rules validation: Total quota must = intake
        const currentQuotaTotal = quotas.reduce((sum, q) => sum + q.total, 0);
        if (currentQuotaTotal !== intake) {
            return res.status(400).json({ error: `Total quota sum (${currentQuotaTotal}) must equal total intake (${intake})` });
        }
        const prog = await Program.create(req.body);
        res.status(201).json(prog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getPrograms = async (req, res) => {
    try {
        const query = req.query.department ? { department: req.query.department } : {};
        const progs = await Program.find(query).populate({
            path: 'department',
            populate: {
                path: 'campus',
                populate: { path: 'institution' }
            }
        });
        res.json(progs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

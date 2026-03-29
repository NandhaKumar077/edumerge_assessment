const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');
const { protect, allow } = require('../middleware/auth');

// Note: GET routes allowed for all authenticated users to populate dropdowns
// POST routes allowed only for Admin

// Institution
router.post('/institution', protect, allow('admin'), masterController.createInstitution);
router.get('/institution', protect, masterController.getInstitutions);

// Campus
router.post('/campus', protect, allow('admin'), masterController.createCampus);
router.get('/campus', protect, masterController.getCampuses);

// Department
router.post('/department', protect, allow('admin'), masterController.createDepartment);
router.get('/department', protect, masterController.getDepartments);

// Program
router.post('/program', protect, allow('admin'), masterController.createProgram);
router.get('/program', protect, masterController.getPrograms);

module.exports = router;

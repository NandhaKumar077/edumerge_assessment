const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicantController');
const { protect, allow } = require('../middleware/auth');

router.use(protect); // All routes require login

// Modification - Admin and Officer only
router.post('/', allow('admin', 'officer'), applicantController.createApplicant);
router.patch('/:id/docs', allow('admin', 'officer'), applicantController.updateDocStatus);
router.patch('/:id/fee', allow('admin', 'officer'), applicantController.updateFeeStatus);

// Reading - All roles
router.get('/', applicantController.getApplicants);

module.exports = router;

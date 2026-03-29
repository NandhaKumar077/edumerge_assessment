const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

router.post('/allocate', allow('admin', 'officer'), admissionController.allocateSeat);
router.post('/confirm', allow('admin', 'officer'), admissionController.confirmAdmission);
router.get('/confirmed', admissionController.getConfirmedAdmissions);

module.exports = router;

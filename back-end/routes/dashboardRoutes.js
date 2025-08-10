const express = require('express');
const getDashboardStats = require('../controller/dashboardController'); // fixed here
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get("/stats", protect, authorize('admin'), getDashboardStats);

module.exports = router;

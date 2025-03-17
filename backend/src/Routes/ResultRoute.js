const express = require('express');
const { saveInterviewResult, fetchInterviewResults } = require('../Controllers/ResultControllers');

const router = express.Router();

// POST route to save interview result
router.post('/save-result', saveInterviewResult);

// GET route to fetch interview results (Change to a more meaningful endpoint)
router.get('/results', fetchInterviewResults);

module.exports = router;

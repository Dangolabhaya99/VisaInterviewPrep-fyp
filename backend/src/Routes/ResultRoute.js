const express = require('express');
const { saveInterviewResult, fetchInterviewResults } = require('../Controllers/ResultControllers');
const AuthMiddleware = require('../Middleware/AuthMiddleware');

const router = express.Router();

router.post('/save-result', saveInterviewResult);

router.get('/results', AuthMiddleware, fetchInterviewResults);

module.exports = router;

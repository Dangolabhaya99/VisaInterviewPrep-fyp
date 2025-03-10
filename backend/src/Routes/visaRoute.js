// routes/responseRoutes.js
const express = require("express");
const router = express.Router();
const { saveResponse } = require("../Controllers/VisaControllers");

// POST request to save response
router.post("/save-response", saveResponse);

module.exports = router;

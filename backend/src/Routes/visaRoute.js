const express = require("express");
const { saveResponse, getResponses } = require("../Controllers/VisaControllers");

const router = express.Router();

router.post("/save-response", saveResponse);
router.get("/responses", getResponses);

module.exports = router;

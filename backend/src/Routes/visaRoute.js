const express = require("express");
const router = express.Router();
const { saveResponse } = require("../Controllers/VisaControllers");

router.post("/save-response", saveResponse);

module.exports = router;

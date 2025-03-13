const express = require("express");
const { getPendingPropertiesForAgent, approveProperty } = require("../controllers/agentController");

const router = express.Router();

// ✅ Get properties pending agent approval
router.get("/pending-properties", getPendingPropertiesForAgent);

// ✅ Approve property and send for final approval
router.put("/approve/:id", approveProperty);

module.exports = router;

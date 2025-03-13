const express = require("express");
const Property = require("../models/Property");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all pending properties
router.get("/pending", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const properties = await Property.find({ status: "Pending Admin Review" });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending properties", error });
  }
});


// Approve property and move to agent verification
router.put("/approve/:id", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.status = "agent_verification";
    await property.save();
    res.json({ message: "Property approved and moved to agent verification", property });
  } catch (error) {
    res.status(500).json({ message: "Approval failed", error });
  }
});

// Reject property
router.delete("/reject/:id", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject property", error });
  }
});

module.exports = router;

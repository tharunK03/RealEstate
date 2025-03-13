const express = require("express");
const path = require("path");
const multer = require("multer");
const Property = require("../models/Property");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ✅ Seller Posts a Property
router.post(
  "/",
  authenticateUser,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      console.log("🔹 Incoming Request Data:", req.body);

      if (req.user.role !== "seller") {
        return res.status(403).json({ message: "Seller Access Required" });
      }

      const { title, price, location, propertyType, areaSize } = req.body;

      if (!title || !price || !location || !propertyType || !areaSize) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (!req.files || !req.files.images || !req.files.documents) {
        return res.status(400).json({ message: "At least one image and document are required." });
      }

      const imagePaths = req.files.images.map((file) => file.path);
      const documentPaths = req.files.documents.map((file) => file.path);

      const property = new Property({
        title,
        price,
        location: { address: location },
        propertyType,
        areaSize,
        images: imagePaths,
        documents: documentPaths,
        seller: req.user._id,
        status: "Pending Admin Review",
      });

      console.log("📝 Saving Property:", property);
      await property.save();
      console.log("✅ Property Saved Successfully!");

      res.status(201).json({ message: "Property submitted for approval!", property });
    } catch (error) {
      console.error("❌ Error in property submission:", error);
      res.status(500).json({ message: "Failed to submit property", error: error.message });
    }
  }
);

// ✅ Fetch all properties for Admin & Agent
router.get("/all", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "agent") {
      return res.status(403).json({ message: "Access denied" });
    }

    const properties = await Property.find();
    console.log("📢 Fetching All Properties:", properties);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
});

// ✅ Admin - Fetch pending properties
router.get("/pending", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const properties = await Property.find({ status: "Pending Admin Review" });
    console.log("📢 Pending Properties for Admin:", properties);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending properties", error });
  }
});

// ✅ Admin - Approve property and assign to Agent
// ✅ Approve property (Admin) and move to Agent Verification
router.put("/approve/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.status = "Agent Assigned"; // ✅ Correct status
    await property.save();
    console.log(`✅ Property ${property._id} Approved for Agent Verification`);
    res.json({ message: "Property approved and assigned to agent", property });
  } catch (error) {
    res.status(500).json({ message: "Approval failed", error });
  }
});

// ✅ Fetch properties for Agent Verification
router.get("/agent-verification", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "agent") {
      return res.status(403).json({ message: "Agent access required" });
    }

    const properties = await Property.find({ status: "Agent Assigned" });
    console.log("📢 Properties for Agent Verification:", properties);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
});

// ✅ Agent - Approve property and send for final review
router.put("/verify/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "agent") {
      return res.status(403).json({ message: "Agent access required" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.status = "Final Admin Review";
    await property.save();
    console.log(`✅ Property ${property._id} Verified by Agent`);
    res.json({ message: "Property verified by agent and moved to final approval", property });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error });
  }
});

// ✅ Final Admin Approval - Mark as Listed
router.put("/final-approve/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.status = "Listed";
    await property.save();
    console.log(`🏡 Property ${property._id} Listed for Buyers`);
    res.json({ message: "Property listed for buyers!", property });
  } catch (error) {
    res.status(500).json({ message: "Final approval failed", error });
  }
});

module.exports = router;

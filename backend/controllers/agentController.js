const Property = require("../models/Property");

// ✅ Get all properties pending agent approval
const getPendingPropertiesForAgent = async (req, res) => {
  try {
    const properties = await Property.find({ status: "agent-pending" }); 
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties for agent", error });
  }
};


// ✅ Approve Property and Send for Final Approval
const approveProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.status = "final_approval"; // ✅ Send for Senior Manager Approval
    await property.save();

    res.status(200).json({ message: "Property approved by agent and sent for final approval." });
  } catch (error) {
    res.status(500).json({ message: "Error approving property", error });
  }
};

module.exports = { getPendingPropertiesForAgent, approveProperty };



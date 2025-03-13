const approvePropertyForAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // ✅ Instead of final approval, send it to agent
    property.status = "agent-pending";
    await property.save();

    console.log(`📢 Property ${id} Approved for Agent Verification`);
    res.status(200).json({ message: "Property sent to agent for verification." });
  } catch (error) {
    res.status(500).json({ message: "Error approving property", error });
  }
};

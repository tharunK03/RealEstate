const Property = require("../models/Property");

const createProperty = async (req, res) => {
    try {
        const { title, location, propertyType, areaSize, price } = req.body;

        // ✅ Ensure only sellers can submit a property
        if (req.user.role !== "seller") {
            return res.status(403).json({ message: "Access Denied: Only sellers can submit properties" });
        }

        // ✅ Ensure all required fields are provided
        if (!title || !location || !propertyType || !areaSize || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if files exist before accessing them
        if (!req.files || !req.files.images || req.files.images.length === 0 || !req.files.documents || req.files.documents.length === 0) {
            return res.status(400).json({ message: "At least one image and one document are required" });
        }

        // ✅ Extract uploaded file paths correctly
        const imageUrls = req.files.images.map((file) => file.path);
        const documentUrls = req.files.documents.map((file) => file.path);

        // ✅ Create a new property with default "Pending Admin Review" status
        const property = new Property({
            title,
            location: { address: location }, // If location is a string, wrap it properly
            propertyType,
            areaSize,
            price,
            images: imageUrls, // ✅ Store multiple images as an array
            documents: documentUrls, // ✅ Store multiple documents as an array
            user: req.user.id,
            status: "Pending Admin Review", // ✅ Initial status for admin approval
        });

        await property.save();
        res.status(201).json({ message: "✅ Property submitted for admin review!", property });
    } catch (error) {
        console.error("❌ Error submitting property:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createProperty };

const Property = require("../models/Property");

const createProperty = async (req, res) => {
    try {
        const { title, location, propertyType, areaSize, price } = req.body;

        if (!title || !location || !propertyType || !areaSize || !price || !req.files.image || !req.files.document) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Get file paths
        const imageUrl = req.files.image[0].path;
        const documentUrl = req.files.document[0].path;

        const property = new Property({
            title,
            location,
            propertyType,
            areaSize,
            price,
            image: imageUrl,
            document: documentUrl,
            user: req.user.id
        });

        await property.save();
        res.status(201).json({ message: "Property submitted for approval", property });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createProperty };
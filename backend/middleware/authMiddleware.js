const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authenticate User Middleware
const authenticateUser = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// Role-Based Access Control Middleware
const roleAuth = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Denied: Insufficient Privileges" });
    }
    next();
};

module.exports = { authenticateUser, roleAuth };
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const path = require("path");

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const agentRoutes = require("./routes/agentRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const renterRoutes = require("./routes/renterRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Allow frontend requests
app.use(cookieParser());

// ✅ Database Connection
connectDB().then(() => {
  console.log("✅ MongoDB Connected Successfully!");
});

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes); // Ensure agent routes are properly set
app.use("/api/buyer", buyerRoutes);

// ✅ Serve Static Files (for file uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚀 Real Estate Backend is Running...");
});

// ✅ Handle 404 Errors
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route Not Found" });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

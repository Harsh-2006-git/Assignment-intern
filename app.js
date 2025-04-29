const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const doctorRoutes = require("./routes/doctorRoutes");
const Doctor = require("./models/Doctor");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Connect to MongoDB - removed deprecated options
// In app.js
const LiveURL = process.env.liveUrl;
mongoose
  .connect(LiveURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// API Routes
app.use("/api/doctors", doctorRoutes);

// Render doctors page at root
// In app.js
app.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({}).lean(); // .lean() for better performance

    res.render("doctors", { doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.render("/doctors", {
      error: "Error loading doctors. Please try again later.",
      doctors: [], // Ensure template doesn't break
    });
  }
});

// Debug route to see raw doctors data
app.get("/debug/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

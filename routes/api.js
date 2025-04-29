// routes/api.js
const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Add doctor API
router.post("/add-doctor", async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// List doctors with filters and pagination
router.get("/list-doctors", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const query = {};

    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    // Filter by experience
    if (req.query.minExperience) {
      query.experience = { $gte: parseInt(req.query.minExperience) };
    }
    if (req.query.maxExperience) {
      query.experience = {
        ...query.experience,
        $lte: parseInt(req.query.maxExperience),
      };
    }

    // Filter by fees
    if (req.query.minFees) {
      query.fees = { $gte: parseInt(req.query.minFees) };
    }
    if (req.query.maxFees) {
      query.fees = { ...query.fees, $lte: parseInt(req.query.maxFees) };
    }

    // Filter by language
    if (req.query.language) {
      query.languages = { $in: [req.query.language] };
    }

    // Filter by consultation mode
    if (req.query.consultMode) {
      query.consultMode = { $in: [req.query.consultMode] };
    }

    // Execute query with pagination
    const doctors = await Doctor.find(query).skip(skip).limit(limit);
    const totalDoctors = await Doctor.countDocuments(query);

    res.json({
      doctors,
      totalPages: Math.ceil(totalDoctors / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

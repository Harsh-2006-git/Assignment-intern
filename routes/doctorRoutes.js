// routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Get all doctors with optional filtering and pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4; // 4 doctors per page
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};

    // Search query (search in name and specialization)
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { specialization: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // ConsultMode filter
    if (req.query.consultMode) {
      const consultModes = Array.isArray(req.query.consultMode)
        ? req.query.consultMode
        : [req.query.consultMode];
      filter.consultMode = { $in: consultModes };
    }

    // Experience filter
    if (req.query.experience) {
      const expRanges = Array.isArray(req.query.experience)
        ? req.query.experience
        : [req.query.experience];

      const expConditions = [];
      expRanges.forEach((range) => {
        if (range === "0-5") {
          expConditions.push({ experience: { $gte: 0, $lte: 5 } });
        } else if (range === "6-10") {
          expConditions.push({ experience: { $gte: 6, $lte: 10 } });
        } else if (range === "11-16") {
          expConditions.push({ experience: { $gte: 11, $lte: 16 } });
        } else if (range === "16+") {
          expConditions.push({ experience: { $gt: 16 } });
        }
      });

      if (expConditions.length > 0) {
        filter.$or = filter.$or
          ? [...filter.$or, ...expConditions]
          : expConditions;
      }
    }

    // Fees filter
    if (req.query.fees) {
      const feeRanges = Array.isArray(req.query.fees)
        ? req.query.fees
        : [req.query.fees];

      const feeConditions = [];
      feeRanges.forEach((range) => {
        if (range === "100-500") {
          feeConditions.push({ fees: { $gte: 100, $lte: 500 } });
        } else if (range === "500-1000") {
          feeConditions.push({ fees: { $gt: 500, $lte: 1000 } });
        } else if (range === "1000+") {
          feeConditions.push({ fees: { $gt: 1000 } });
        }
      });

      if (feeConditions.length > 0) {
        filter.$or = filter.$or
          ? [...filter.$or, ...feeConditions]
          : feeConditions;
      }
    }

    // Languages filter
    if (req.query.languages) {
      const languages = Array.isArray(req.query.languages)
        ? req.query.languages
        : [req.query.languages];
      filter.languages = { $in: languages };
    }

    // Gender filter
    if (req.query.gender) {
      const genders = Array.isArray(req.query.gender)
        ? req.query.gender
        : [req.query.gender];
      filter.gender = { $in: genders };
    }

    // Specialization filter
    if (req.query.specialization) {
      const specializations = Array.isArray(req.query.specialization)
        ? req.query.specialization
        : [req.query.specialization];
      filter.specialization = { $in: specializations };
    }

    // Sort options
    let sortOption = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case "experience-high":
          sortOption = { experience: -1 };
          break;
        case "experience-low":
          sortOption = { experience: 1 };
          break;
        case "fees-high":
          sortOption = { fees: -1 };
          break;
        case "fees-low":
          sortOption = { fees: 1 };
          break;
        case "relevance":
        default:
          sortOption = { rating: -1 }; // Default sort by rating (highest first)
          break;
      }
    } else {
      // Default sort by rating
      sortOption = { rating: -1 };
    }

    // Count total matching doctors
    const totalDoctors = await Doctor.countDocuments(filter);
    const totalPages = Math.ceil(totalDoctors / limit);

    // Get filtered doctors with pagination and sorting
    const doctors = await Doctor.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Return paginated results
    res.json({
      doctors,
      currentPage: page,
      totalPages,
      totalDoctors,
    });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get distinct specializations for filter options
router.get("/filters/specializations", async (req, res) => {
  try {
    const specializations = await Doctor.distinct("specialization");
    res.json(specializations);
  } catch (err) {
    console.error("Error fetching specializations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get distinct languages for filter options
router.get("/filters/languages", async (req, res) => {
  try {
    const languages = await Doctor.distinct("languages");
    res.json(languages);
  } catch (err) {
    console.error("Error fetching languages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

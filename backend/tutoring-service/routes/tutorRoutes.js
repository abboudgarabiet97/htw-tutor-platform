const express = require("express");
const multer = require("multer");
const Tutor = require("../models/Tutor");
const requireAuth = require("../middleware/auth");
const { uploadTutorImage } = require("../utils/imageStorage");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public: list all tutors, optionally filtered by course
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    const tutors = await Tutor.find(filter).sort({ createdAt: -1 });
    res.json({ tutors });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tutors", error: err.message });
  }
});

// Public: get a single tutor profile
router.get("/:id", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });
    res.json({ tutor });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tutor", error: err.message });
  }
});

// Protected: create a tutor profile, with an optional image uploaded to Cloudinary
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { name, subject, course, bio, pricePerHour } = req.body;
    if (!name || !subject || !course || !pricePerHour) {
      return res.status(400).json({ message: "name, subject, course and pricePerHour are required" });
    }

    let imageUrl = "";
    if (req.file) {
      const uploadedUrl = await uploadTutorImage(req.file.buffer);
      imageUrl = uploadedUrl || "";
    }

    const tutor = await Tutor.create({
      userId: req.user.id,
      name,
      subject,
      course,
      bio: bio || "",
      pricePerHour,
      imageUrl,
    });

    res.status(201).json({ tutor });
  } catch (err) {
    res.status(500).json({ message: "Failed to create tutor profile", error: err.message });
  }
});

module.exports = router;

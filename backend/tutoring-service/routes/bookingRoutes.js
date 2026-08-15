const express = require("express");
const fetch = require("node-fetch");
const Booking = require("../models/Booking");
const Tutor = require("../models/Tutor");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Protected: book a session with a tutor. After saving the booking we call
// the serverless booking-notification function so a confirmation is sent
// out asynchronously, without the tutoring-service having to know about
// email/SMS providers itself.
router.post("/", requireAuth, async (req, res) => {
  try {
    const { tutorId, sessionDate } = req.body;
    if (!tutorId || !sessionDate) {
      return res.status(400).json({ message: "tutorId and sessionDate are required" });
    }

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });

    const booking = await Booking.create({
      tutorId,
      studentId: req.user.id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      sessionDate,
      status: "pending",
    });

    const functionUrl = process.env.NOTIFICATION_FUNCTION_URL;
    if (functionUrl) {
      fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: booking.studentName,
          studentEmail: booking.studentEmail,
          tutorName: tutor.name,
          subject: tutor.subject,
          sessionDate: booking.sessionDate,
        }),
      }).catch((err) => console.error("Notification function call failed:", err.message));
    }

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
});

// Protected: get bookings for the logged-in student
router.get("/me", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user.id })
      .populate("tutorId", "name subject course")
      .sort({ sessionDate: 1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
});

module.exports = router;

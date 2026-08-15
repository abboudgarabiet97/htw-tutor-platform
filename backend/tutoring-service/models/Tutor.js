const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    course: { type: String, required: true }, // e.g. HTW course code such as "INF101"
    bio: { type: String, default: "" },
    pricePerHour: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tutor", tutorSchema);

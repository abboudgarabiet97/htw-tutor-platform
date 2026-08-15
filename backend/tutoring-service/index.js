require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const tutorRoutes = require("./routes/tutorRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "tutoring-service is up" });
});

app.use("/api/tutors", tutorRoutes);
app.use("/api/bookings", bookingRoutes);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/htw_tutoring")
  .then(() => {
    console.log("Tutoring service connected to MongoDB");
    app.listen(PORT, () => console.log(`Tutoring service listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "auth-service is up" });
});

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/htw_auth")
  .then(() => {
    console.log("Auth service connected to MongoDB");
    app.listen(PORT, () => console.log(`Auth service listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

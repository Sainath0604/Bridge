const mongoose = require("mongoose");

const connectDB = async (dbName = "whatsapp") => {
  const isProduction = process.env.NODE_ENV === "production";
  const mongoUrl = isProduction
    ? `${process.env.DATABASE_URL}/${dbName}`
    : `mongodb://0.0.0.0:27017/${dbName}`;

  try {
    await mongoose.connect(mongoUrl);
    console.log(
      `✅ MongoDB connected to ${isProduction ? "production" : "local"}`
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;

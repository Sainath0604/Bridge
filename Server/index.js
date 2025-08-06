require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const db_name = "bridge";

app.use(cors());
app.use(express.json());

const mongoUrl = isProduction
  ? `${process.env.DATABASE_URL}/${db_name}`
  : `mongodb://0.0.0.0:27017/${db_name}`;

mongoose
  .connect(mongoUrl)
  .then(() =>
    console.log(
      `✅ MongoDB connected to ${isProduction ? "production" : "local"}`
    )
  )
  .catch((e) => console.error("❌ MongoDB connection error:", e));

app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});

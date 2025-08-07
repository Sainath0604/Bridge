require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

const messageRoutes = require("./routes/messageRoutes");
app.use("/api", messageRoutes);

app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});

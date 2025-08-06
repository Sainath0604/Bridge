require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const messageRoutes = require("./routes/messageRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoutes);

app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});

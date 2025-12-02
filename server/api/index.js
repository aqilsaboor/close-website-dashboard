const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
import serverless from "serverless-http";

const app = express();
const closeRoutes = require("./routes/closeRoutes");

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/close", closeRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});


export default serverless(app);

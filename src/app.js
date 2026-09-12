const express = require("express");
const Routes = require("./routes/Routes");
const cors = require("cors");

const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/api/user", Routes);

module.exports = app;
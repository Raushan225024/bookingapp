const express = require("express");
const Routes = require("./routes/Routes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", Routes);

module.exports = app;
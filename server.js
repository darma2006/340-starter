/******************************************
 * server.js - Main server file
 ******************************************/

const path = require('path');

// Require Statements
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();

const app = express();
const staticRoutes = require("./routes/static"); // Assuming you have routes/static.js

/***********************
 * Middleware
 ***********************/

// Serve static files from the public directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.use(expressLayouts);

// Specify layout file (if not in views root)
app.set("layout", "./layouts/layout");

// Use static routes (placed after view engine setup)
app.use(staticRoutes);

/***********************
 * Routes
 ***********************/

// Home page route
app.get("/", function (req, res) {
  res.render("index", { title: "Home" });
});

/***********************
 * Start the Server
 ***********************/

const port = 3000; // or any other unused port like 3030 or 4000
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

/* ******************************************
 * Primary server file for the application
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require("./database/")

/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}))

// Accept form POST data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

// Flash messages
app.use(require("connect-flash")())
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use(staticRoutes)

/* ***********************
 * 404 Handler
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * General Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  res.status(err.status || 500)
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message || "Oh no, something went wrong.",
    nav,
  })
})

/* ***********************
 * Server Info for Render
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "0.0.0.0"

/* ***********************
 * Start Server
 *************************/
app.listen(port, host, () => {
  console.log(`App listening on http://${host}:${port}`)
})

const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const checkJWT = utilities.checkJWTToken

// ========================================
// Account Management (protected route)
// ========================================
router.get(
  "/",
  checkJWT,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// ========================================
// Logout
// ========================================
router.get("/logout", accountController.logout)

// ========================================
// Login / Register Views
// ========================================
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// ========================================
// Registration
// ========================================
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
)

// ========================================
// Login Processing
// ========================================
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router

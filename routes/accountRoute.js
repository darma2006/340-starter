const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const checkJWT = utilities.checkJWTToken
const accountValidate = require("../utilities/account-validation")


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


router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))


router.post("/update",
  accountValidate.updateRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.processAccountUpdate)
)


router.post("/update-password",
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.processPasswordUpdate)
)


module.exports = router

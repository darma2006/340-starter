const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (email) => {
        const emailExists = await accountModel.checkExistingEmail(email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email.")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}


validate.updateRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name required."),
    body("account_email").trim().isEmail().withMessage("Valid email required.")
      .custom(async (account_email, { req }) => {
         
         const existing = await accountModel.checkExistingEmail(account_email)
         if (existing && existing.account_id != req.body.account_id) {
           throw new Error("Email exists. Use a different email.")
         }
         return true
      })
  ]
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    
    return res.status(400).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array().map(err => err.msg),
      messages: [],
      account: {
        account_id: req.body.account_id,
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email
      }
    })
  }
  next()
}

// password rules
validate.passwordRules = () => {
  return [
    body("new_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      }).withMessage("Password does not meet requirements.")
  ]
}

validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    
    const account = await accountModel.getAccountById(req.body.account_id)
    return res.status(400).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array().map(err => err.msg),
      messages: [],
      account
    })
  }
  next()
}


/* ******************************
 * Check Registration Data
 ******************************** */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()

    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array().map(err => err.msg),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    })
  }
  next()
}

/* **********************************
 * Login Validation Rules
 ********************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* **********************************
 * Check Login Data
 ********************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()

    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array().map(err => err.msg),
      account_email: req.body.account_email,
    })
  }
  next()
}

module.exports = validate

const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);  // 10 salt rounds
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.');
      return res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }

    // Call the model to insert the account, with hashed password
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );


    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

const jwt = require("jsonwebtoken")

async function processLogin(req, res) {
  const { email, password } = req.body

  const accountData = await accountModel.login(email, password)

  if (!accountData) {
    req.flash("notice", "Incorrect email or password.")
    return res.status(400).redirect("/account/login")
  }

  const payload = {
    account_id: accountData.account_id,
    account_type: accountData.account_type,
    account_firstname: accountData.account_firstname
  }

  const token = jwt.sign(payload, process.env.SESSION_SECRET, {
    expiresIn: "1h"
  })

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 3600000 
  })

  return res.redirect("/account/")
}


function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav()
  
    const accountData = res.locals.accountData || {}
    const loggedin = !!res.locals.loggedin

    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData, 
      loggedin,
      notice: req.flash("notice") || []
    })
  } catch (err) {
    next(err)
  }
}



// deliver update view
async function buildUpdateAccount(req, res, next) {
  try {
    const accountId = parseInt(req.params.accountId)
    const nav = await utilities.getNav()
    const account = await accountModel.getAccountById(accountId)
    if (!account) {
      req.flash("notice", "Account not found.")
      return res.redirect("/account/")
    }
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      messages: [],
      errors: null,
      account
    })
  } catch (err) {
    next(err)
  }
}

// process account info update
async function processAccountUpdate(req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
    if (updateResult) {
      req.flash("notice", "Account updated successfully.")
    
      const nav = await utilities.getNav()
      const account = await accountModel.getAccountById(account_id)
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData: account,
        loggedin: 1,
        notice: req.flash("notice")
      })
    } else {
      req.flash("notice", "Update failed.")
      return res.redirect(`/account/update/${account_id}`)
    }
  } catch (err) {
    next(err)
  }
}

// process password change
async function processPasswordUpdate(req, res, next) {
  try {
    const { account_id, new_password } = req.body
    const hashed = await bcrypt.hash(new_password, 10)
    const result = await accountModel.updatePassword(account_id, hashed)
    if (result) {
      req.flash("notice", "Password updated successfully.")
      // re-render account management
      const nav = await utilities.getNav()
      const account = await accountModel.getAccountById(account_id)
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData: account,
        loggedin: 1,
        notice: req.flash("notice")
      })
    } else {
      req.flash("notice", "Password update failed.")
      return res.redirect(`/account/update/${account_id}`)
    }
  } catch (err) {
    next(err)
  }
}



module.exports = {
  processLogin,
  buildLogin,
  buildRegister,
  registerAccount,
  logout,
  accountLogin,
  buildAccountManagement,
  processAccountUpdate,
  processPasswordUpdate
};

const jwt = require("jsonwebtoken")

function checkJWT(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET)
    res.locals.accountData = decoded
    next()
  } catch (error) {
    req.flash("notice", "Invalid session. Please log in again.")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
}

module.exports = checkJWT

const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require("../utilities/")

/* ************************
 * Build nav menu
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}"
         title="See our inventory of ${row.classification_name} vehicles">
         ${row.classification_name}
      </a>
    </li>`
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Error wrapper
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)


/* **************************************
 * Build classification grid
 ************************************** */
Util.buildClassificationGrid = function (data) {
  if (!data.length) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = "<ul id='inv-display'>"

  data.forEach(vehicle => {
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" 
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </a>

        <div class="namePrice">
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      </li>
    `
  })

  grid += "</ul>"
  return grid
}


/* **************************************
 * Build detail page
 ************************************** */
Util.buildDetailView = function (v) {
  return `
    <section class="vehicle-detail">
      <img src="${v.inv_image}" alt="${v.inv_make} ${v.inv_model}" class="vehicle-detail-img">

      <div class="vehicle-info">
        <h2>${v.inv_year} ${v.inv_make} ${v.inv_model}</h2>
        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(v.inv_price)}</p>
        <p><strong>Description:</strong> ${v.inv_description}</p>
        <p><strong>Color:</strong> ${v.inv_color}</p>
        <p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(v.inv_miles)}</p>
      </div>
    </section>
  `
}

/* **************************************
 * Build classification <select>
 ************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let list = '<select name="classification_id" id="classificationList" required>'
  list += "<option value=''>Choose a Classification</option>"

  data.forEach(row => {
    list += `<option value="${row.classification_id}" ${classification_id == row.classification_id ? "selected" : ""}>
               ${row.classification_name}
             </option>`
  })

  list += "</select>"
  return list
}

/* ****************************************
 * Build inventory list HTML table
 **************************************** */
Util.buildInventoryList = async function (inventoryData) {
  let list = `
    <table class="inv-table">
      <thead>
        <tr>
          <th>Vehicle</th>
          <th>Year</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `

  inventoryData.forEach(vehicle => {
    list += `
      <tr>
        <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
        <td>${vehicle.inv_year}</td>
        <td>
          <a href="/inv/edit/${vehicle.inv_id}">Edit</a>
        </td>
      </tr>
    `
  })

  list += `
      </tbody>
    </table>
  `

  return list
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


Util.checkAdmin = (req, res, next) => {

  const accountData = res.locals.accountData
  if (accountData && (accountData.account_type === "Employee" || accountData.account_type === "Admin")) {
    return next()
  }

  req.flash("notice", "You must be an employee or admin to access that page.")
  return res.redirect("/account/login")
}


module.exports = Util

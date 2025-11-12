const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getVehicleByInvId(inv_id)

    // Handle case if no data found
    if (!data || data.length === 0) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    const vehicle = data[0]
    const itemHTML = await utilities.buildVehicleDetail(vehicle)
    let nav = await utilities.getNav()
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("./inventory/detail", {
      title: itemName,
      nav,
      itemHTML,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Trigger intentional 500 error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  // This throws an intentional server error for testing
  throw new Error("Intentional 500 error triggered for testing purposes!")
}

module.exports = invCont

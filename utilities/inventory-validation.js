const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/* ******************************
 * Classification Data Validation Rules
 ****************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 2 })
      .withMessage("Classification name must be at least 2 characters.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters."),
  ]
}

/* ******************************
 * Check classification data
 ****************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()

    return res.status(400).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,  // ⭐ FIXED: send full error object
      classification_name: req.body.classification_name,
      message: null,
    })
  }
  next()
}

/* ******************************
 * Inventory Validation Rules
 ****************************** */
validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").trim().notEmpty().isFloat({ gt: 0 }).withMessage("Price must be a number greater than zero."),
    body("inv_year").trim().notEmpty().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Please provide a valid year."),
    body("inv_miles").trim().notEmpty().isInt({ min: 0 }).withMessage("Miles must be a non-negative integer."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
    body("classification_id").trim().notEmpty().withMessage("Classification is required."),
  ]
}

/* ******************************
 * Check inventory data
 ****************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)

    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      errors,  // ⭐ FIXED: send full error object
      classificationList,
      // Sticky form data:
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_year: req.body.inv_year,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      message: null,
    })
  }
  next()
}

/* ******************************
 * Check edit inventory data
 * ***************************** */
validate.checkEditInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    )

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + req.body.inv_make + " " + req.body.inv_model,
      nav,
      classificationList,
      errors: errors.array(),
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_year: req.body.inv_year,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_id: req.body.inv_id
    })
  }

  next()
}

/* ******************************
 * Check update data and return errors (for edit view)
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + (req.body.inv_make || ""),
      nav,
      errors: errors.array().map(err => err.msg),
      classificationList,
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_year: req.body.inv_year,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      message: null,
    })
  }
  next()
}


module.exports = validate

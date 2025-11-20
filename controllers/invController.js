const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Deliver add classification view
 *************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: null,
    messages: []
  })
}

/* ***************************
 * Process the add classification form
 *************************** */
invCont.processAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const regResult = await invModel.addClassification(classification_name)

    if (regResult) {
      nav = await utilities.getNav()
      req.flash("success", `New classification "${classification_name}" added successfully.`)
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash("success") || []
      })
    } else {
      req.flash("error", "Sorry, adding the classification failed.")
      res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
        messages: req.flash("error") || []
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Deliver add inventory view
 *************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationSelect,
      errors: null,
      messages: [],
      inv_make: null,
      inv_model: null,
      inv_description: null,
      inv_image: null,
      inv_thumbnail: null,
      inv_price: null,
      inv_year: null,
      inv_miles: null,
      inv_color: null
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Process add inventory form
 *************************** */
invCont.processAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    } = req.body

    const regResult = await invModel.addInventoryItem(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (regResult) {
      const navUpdated = await utilities.getNav()
      req.flash("success", `${inv_make} ${inv_model} added successfully.`)

      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav: navUpdated,
        messages: req.flash("success") || []
      })
    } else {
      req.flash("error", "Sorry, adding the inventory item failed.")

      res.status(500).render("inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav,
        classificationSelect,
        errors: null,
        messages: req.flash("error") || [],
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build inventory management view
 *************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const inventory = await invModel.getInventory()

    const inventoryList = await utilities.buildInventoryList(inventory)

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      inventoryList,
      messages: req.flash("notice") || []
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 * Build classification view
 *************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId)
    const nav = await utilities.getNav()

    const data = await invModel.getInventoryByClassificationId(classification_id)

    const className = data[0]?.classification_name || "Vehicles"

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      vehicles: data
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build vehicle detail page
 *************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)

    const data = await invModel.getInventoryByInvId(inv_id)
    const nav = await utilities.getNav()

    if (!data) {
      req.flash("notice", "Vehicle not found.")
      return res.status(404).render("inventory/detail", {
        title: "Vehicle Not Found",
        nav,
        detailView: "",
        message: req.flash("notice")
      })
    }

    const detailView = await utilities.buildDetailView(data)

    res.render("inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      detailView,
      message: null
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Step 8 — Edit Inventory View
 *************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    const nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInvId(inv_id)

    const classificationList = await utilities.buildClassificationList(
      itemData.classification_id
    )

    res.render("inventory/edit-inventory", {
      title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      classificationList,
      errors: null,
      messages: [],
      ...itemData
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Build Edit Inventory Form
 **************************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)

  const itemData = await invModel.getInventoryByInvId(inv_id)
  const nav = await utilities.getNav()

  if (!itemData) {
    req.flash("notice", "Vehicle not found.")
    return res.redirect("/inv/")
  }

  const classificationList = await utilities.buildClassificationList(itemData.classification_id)

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemData.inv_make + " " + itemData.inv_model,
    nav,
    classificationList,
    errors: null,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_year: itemData.inv_year,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    inv_id: itemData.inv_id
  })
}


/* ***************************
 * Step 8 — Process Inventory Update
 *************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    } = req.body

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    const nav = await utilities.getNav()

    if (updateResult) {
      req.flash("notice", `${inv_make} ${inv_model} was successfully updated.`)
      return res.redirect("/inv/")
    }

    req.flash("notice", "Update failed.")
    const classificationList = await utilities.buildClassificationList(classification_id)

    res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      errors: null,
      messages: req.flash("notice"),
      ...req.body
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Build Edit Inventory View
 * *************************************** */
invCont.buildEditInventory = async function (req, res) {
  const inv_id = parseInt(req.params.invId)

  const itemData = await invModel.getInventoryById(inv_id)
  const nav = await utilities.getNav()

  const classificationList = await utilities.buildClassificationList(itemData.classification_id)

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemData.inv_make + " " + itemData.inv_model,
    nav,
    errors: null,
    classificationList,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_year: itemData.inv_year,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    inv_id: itemData.inv_id,
  })
}


module.exports = invCont

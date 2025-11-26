const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build Add Classification View
 *************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: "",
      messages: []
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Process Add Classification
 *************************** */
invCont.processAddClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const nav = await utilities.getNav()

    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", `Classification "${classification_name}" added successfully.`)
      return res.redirect("/inv/")
    }

    req.flash("notice", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
      messages: req.flash("notice")
    })

  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build Add Inventory View
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
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: ""
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Process Add Inventory
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

    const result = await invModel.addInventoryItem(
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

    if (result) {
      req.flash("notice", `${inv_make} ${inv_model} added successfully.`)
      return res.redirect("/inv/")
    }

    req.flash("notice", "Failed to add inventory item.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationSelect,
      errors: null,
      messages: req.flash("notice"),
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
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      inventory,  
      inventoryList,
      classificationSelect,
      messages: req.flash("notice") || []
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 * View Inventory by Classification
 *************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId)
    const nav = await utilities.getNav()

    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      req.flash("notice", "No inventory found for this classification.")
      return res.redirect("/inv/")
    }

    const className = data[0].classification_name

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
 * Build Inventory Detail View
 *************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    const data = await invModel.getInventoryByInvId(inv_id)
    const nav = await utilities.getNav()

    if (!data) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/inv/")
    }

    const detailView = utilities.buildDetailView(data)

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
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)

    const nav = await utilities.getNav()

    const itemData = await invModel.getInventoryByInvId(inv_id)

    if (!itemData) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/inv/")
    }

    const classificationSelect =
      await utilities.buildClassificationList(itemData.classification_id)

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,

      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 * Process Inventory Update
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

    const result = await invModel.updateInventory(
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

    if (result) {
      req.flash("notice", `${inv_make} ${inv_model} updated successfully.`)
      return res.redirect("/inv/")
    }

    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)

    req.flash("notice", "Update failed.")
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

/* ***************************
 * Return Inventory by Classification as JSON
 *************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (!invData || invData.length === 0) {
      return res.json({ message: "No data available" })
    }

    res.json(invData)

  } catch (error) {
    next(error)
  }
}

module.exports = invCont

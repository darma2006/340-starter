const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to show add classification form
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to process add classification form
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification)
)

// Route to show add inventory form
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Route to process add inventory form
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.processAddInventory)
)

// Inventory management view
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Build vehicles by classification
router.get("/type/:classificationId", invController.buildByClassificationId)

// Vehicle detail route
router.get("/detail/:invId", invController.buildInventoryDetail)

// Route to view edit form
router.get(
  "/edit/:invId",
  utilities.handleErrors(invController.editInventoryView)
)

// Route to process inventory update
router.post(
  "/update",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to get edit inventory form
router.post(
  "/update/",
  validate.inventoryRules(),
  validate.checkEditInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

// POST route to update an inventory item
router.post(
  "/update/",
  validate.inventoryRules(),
  validate.checkEditInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get("/edit/:invId", invController.editInventoryView, utilities.handleErrors)

// Process the inventory update
router.post(
  "/update",
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)


module.exports = router

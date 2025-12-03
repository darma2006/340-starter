const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const favController = require("../controllers/favoritesController")

// View all favorites
router.get(
  "/",
  utilities.checkLogin,
  favController.buildFavoritesView
)

// Add favorite
router.post(
  "/add",
  utilities.checkLogin,
  favController.addFavorite
)

// Delete favorite
router.post(
  "/delete",
  utilities.checkLogin,
  favController.deleteFavorite
)

module.exports = router

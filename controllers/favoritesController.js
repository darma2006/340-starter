const favoriteModel = require("../models/favorites-model")
const utilities = require("../utilities/")

async function addFavorite(req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  const result = await favoriteModel.addFavorite(account_id, inv_id)

  if (!result) {
    req.flash("error", "Could not add to favorites.")
  } else {
    req.flash("notice", "Vehicle added to favorites!")
  }

  res.redirect(`/inv/detail/${inv_id}`)
}

/* Build favorites page */
async function buildFavoritesView(req, res, next) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id

  const favorites = await favoriteModel.getFavoritesByAccount(account_id)

  res.render("favorites/index", {
    title: "My Favorites",
    nav,
    favorites,
    messages: req.flash(),
  })
}

/* Delete favorite */
async function deleteFavorite(req, res) {
  const { favorite_id } = req.body

  await favoriteModel.deleteFavorite(favorite_id)

  req.flash("notice", "Favorite removed.")
  res.redirect("/account/favorites")
}

module.exports = { addFavorite, buildFavoritesView, deleteFavorite }

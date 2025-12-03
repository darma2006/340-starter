const pool = require("../database/")

async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *;
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("addFavorite error:", error)
    return null
  }
}

/* Get all favorites for a user */
async function getFavoritesByAccount(account_id) {
  try {
    const sql = `
      SELECT f.favorite_id, i.inv_make, i.inv_model, i.inv_id
      FROM favorites f
      JOIN inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY favorite_id DESC;
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getFavoritesByAccount error:", error)
  }
}

/* Delete */
async function deleteFavorite(favorite_id) {
  try {
    const sql = `DELETE FROM favorites WHERE favorite_id = $1`
    const data = await pool.query(sql, [favorite_id])
    return data.rowCount
  } catch (error) {
    console.error("deleteFavorite error:", error)
  }
}

module.exports = { addFavorite, getFavoritesByAccount, deleteFavorite }

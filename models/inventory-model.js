const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data.rows
  } catch (error) {
    console.error("getClassifications error " + error)
  }
}

/* ***************************
 *  Get inventory by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
    throw error
  }
}

/* ***************************
 * Get vehicle by inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInvId error " + error)
    throw error
  }
}

/* ***************************
 * Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error: ", error)
    return null
  }
}

/* ***************************
 * Add new inventory item
 * ************************** */
async function addInventoryItem(
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
) {
  try {
    const sql = `INSERT INTO public.inventory 
      (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addInventoryItem error: ", error)
    return null
  }
}

/* ***************************
 * Inventory list for management
 * ************************** */
async function getInventory() {
  try {
    const data = await pool.query(
      `SELECT inv_id, inv_make, inv_model, inv_year, inv_price
       FROM public.inventory
       ORDER BY inv_make, inv_model`
    )
    return data.rows
  } catch (error) {
    console.error("getInventory error: " + error)
    throw error
  }
}

/* ***************************
 * Register classification
 * ************************** */
async function registerClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *;
    `;
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

async function updateInventory(
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
) {
  try {
    const sql = `
      UPDATE inventory
      SET 
        inv_make = $1,
        inv_model = $2,
        inv_description = $3,
        inv_image = $4,
        inv_thumbnail = $5,
        inv_price = $6,
        inv_year = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
      WHERE inv_id = $11
      RETURNING *
    `
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])

    return data.rows[0]
  } catch (error) {
    console.error("Update Inventory Error:", error)
    return null
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      `UPDATE public.inventory
       SET inv_make = $1,
           inv_model = $2,
           inv_description = $3,
           inv_image = $4,
           inv_thumbnail = $5,
           inv_price = $6,
           inv_year = $7,
           inv_miles = $8,
           inv_color = $9,
           classification_id = $10
       WHERE inv_id = $11
       RETURNING *`
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("updateInventory model error: " + error)
    return null
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
    const result = await pool.query(sql, [inv_id])
    // result.rowCount will be 1 if a row was deleted, 0 if none
    return result.rowCount
  } catch (error) {
    console.error("deleteInventoryItem error: " + error)
    return 0
  }
}


module.exports = {
  registerClassification,
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  addClassification,
  addInventoryItem,
  getInventory,
  updateInventory,
  deleteInventoryItem
}

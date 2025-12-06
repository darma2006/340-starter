const { Pool } = require("pg")
require("dotenv").config()

let pool

// ALWAYS use SSL in Render
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text, error })
      throw error
    }
  }
}

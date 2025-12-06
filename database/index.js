const { Pool } = require("pg");
require("dotenv").config();

let pool;

/*
 * Use SSL on BOTH development and production.
 * Render requires SSL: rejectUnauthorized: false
 * Local also works fine with this.
 */

pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Unified query wrapper for ALL environments
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text, error });
      throw error;
    }
  }
};
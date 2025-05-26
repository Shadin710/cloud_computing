const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false}
});
console.log(pool);
module.exports = pool
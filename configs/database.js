const mysql = require('mysql2/promise');
require('dotenv').config();
const config = require('../utils/config');
const { host, user, password, database, port } = config.mysql;

const pool = mysql.createPool({
  port: port,
  host: host,
  user: user,
  password: password,
  database: database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL!');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();

module.exports = pool;
require('dotenv').config();
const mysql = require('mysql2/promise');

// Validate required database environment variables
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`CRITICAL: ${varName} is not defined in .env file`);
  }
});

// Create a pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true
});

async function DBConnect() {
  try {
    // Test connection
    const connection = await pool.getConnection();
    connection.release();
    return pool;
  } catch (error) {
    console.error('Failed to connect to the database pool:', error.message);
    throw error;
  }
}

module.exports = DBConnect;
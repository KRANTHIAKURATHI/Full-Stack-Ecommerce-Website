const mysql = require('mysql2/promise');


async function DBConnect() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '$$Pk2005?',
      database: 'amazondb',
      
    });

    console.log('Database connected successfully');
    return db;
  } catch (error) {
    console.error(' Failed to connect to the database:', error.message);
    throw error;
  }
}

module.exports = DBConnect;

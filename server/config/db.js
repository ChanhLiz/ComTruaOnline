const mysql = require("mysql2/promise");

console.log("DB_HOST =", process.env.DB_HOST);
console.log("LOCAL_DB_HOST =", process.env.LOCAL_DB_HOST);
console.log("LOCAL_DB_USER =", process.env.LOCAL_DB_USER);
console.log("LOCAL_DB_PASSWORD =", process.env.LOCAL_DB_PASSWORD);
console.log("LOCAL_DB_NAME =", process.env.LOCAL_DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.LOCAL_DB_HOST,
  port: Number(process.env.DB_PORT || process.env.LOCAL_DB_PORT),
  user: process.env.DB_USER || process.env.LOCAL_DB_USER,
  password: process.env.DB_PASSWORD || process.env.LOCAL_DB_PASSWORD,
  database: process.env.DB_NAME || process.env.LOCAL_DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
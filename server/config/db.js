require("dotenv").config();
const mysql = require("mysql2/promise");

const isRailway =
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.RAILWAY_PROJECT_ID;

const pool = mysql.createPool({
  host: isRailway
    ? process.env.DB_HOST
    : (process.env.LOCAL_DB_HOST || "localhost"),

  port: isRailway
    ? Number(process.env.DB_PORT)
    : Number(process.env.LOCAL_DB_PORT || 3306),

  user: isRailway
    ? process.env.DB_USER
    : (process.env.LOCAL_DB_USER || "root"),

  password: isRailway
    ? process.env.DB_PASSWORD
    : (process.env.LOCAL_DB_PASSWORD || ""),

  database: isRailway
    ? process.env.DB_NAME
    : (process.env.LOCAL_DB_NAME || "ecommerce_db"),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
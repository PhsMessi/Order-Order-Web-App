import mysql2 from "mysql2";
import dotenv from "dotenv";

// dapat e run kay we use env to security.
dotenv.config();
const mysql = mysql2.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// mysql connection

const db = () => {
  mysql.connect((error) => {
    if (error) {
      console.error("Error connecting to database:", error.message);
      return;
    }
    console.log(`Connected to MySQL database successfully!`);
  });
};

export { mysql, db };

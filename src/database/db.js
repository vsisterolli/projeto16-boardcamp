import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config()

const { Pool } = pkg;
console.log(process.env.DATABASE_URL)

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

export default connection;
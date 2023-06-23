require("dotenv").config();

const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;

module.exports = {
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  DATABASE_PORT,
};

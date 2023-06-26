const Sequelize = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    host: config.DATABASE_PORT,
    dialect: "mysql",
  }
);

const db = {};
db.sequelize = sequelize;
db.books = require("../models/books");
db.category = require("../models/category");
db.admin = require("../models/admin");
db.customer = require("../models/customer");

db.category.hasOne(db.books, { foreignKey: "Category_Type" });
db.books.belongsTo(db.category, { foreignKey: "Category_Type" });
// const test = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// test();

module.exports = { sequelize, db };

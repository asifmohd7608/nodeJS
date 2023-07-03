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
db.purchase = require("../models/purchase");
db.coupons = require("../models/coupon");

db.category.hasOne(db.books, { foreignKey: "Category_Type" });
db.books.belongsTo(db.category, { foreignKey: "Category_Type" });

db.customer.hasOne(db.purchase, { foreignKey: "Customer_Id" });
db.purchase.belongsTo(db.customer, { foreignKey: "Customer_Id" });

db.books.hasOne(db.purchase, { foreignKey: "Book_Id" });
db.purchase.belongsTo(db.books, { foreignKey: "Book_Id" });

db.coupons.hasOne(db.purchase, { foreignKey: "Coupon_Id" });
db.purchase.belongsTo(db.coupons, { foreignKey: "Coupon_Id" });
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

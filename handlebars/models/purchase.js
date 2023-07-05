const { Sequelize, DataTypes } = require("sequelize");
const {
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} = require("../config/config");

const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  { host: DATABASE_PORT, dialect: "mysql" }
);

const purchase = sequelize.define("purchase", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Purchase_Count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Subtotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Discount_Amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
module.exports = purchase;

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
const coupon = sequelize.define("coupon", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Coupon_Offer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Coupon_Type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Coupon_Status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Image_Path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Validity_Start: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Validity_End: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Coupon_Category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = coupon;

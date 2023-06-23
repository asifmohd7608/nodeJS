const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    host: config.DATABASE_PORT,
    dialect: "mysql",
  }
);

const book = sequelize.define(
  "book",
  {
    // tablename,{columns}
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Book_Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Publication_Year: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    No_Of_Copies_Actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    No_Of_Copies_Current: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    File_Path: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);
module.exports = book;

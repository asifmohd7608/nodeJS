const express = require("express");
const app = express();

const token = app.use((req, res, next) => {
  req.token = true;
  next();
});

module.exports = { token };

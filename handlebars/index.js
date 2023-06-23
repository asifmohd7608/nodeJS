const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const { db } = require("./config/database");
const router = require("./routes");
const cookieParser = require("cookie-parser");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//partials & helpers--------------------------
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("caps", (value) => {
  return value.toUpperCase();
});
hbs.registerHelper("if_eq", function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

hbs.registerHelper("ifCond", function (option, value, trueValue, falseValue) {
  if (option === value) {
    return trueValue;
  } else {
    return falseValue;
  }
});
hbs.registerHelper("ifequals", function (option, value, trueValue, falseValue) {
  if (option == value) {
    return trueValue;
  } else {
    return falseValue;
  }
});

//syncing db--------------------
try {
  // db.admin.sync({ alter: true });
  // db.books.sync({ alter: true });
  db.sequelize.sync({ alter: true });
} catch (error) {
  console.log(error);
}
app.use(router);

app.listen(3000, () => {
  console.log("listening to port 3000");
});

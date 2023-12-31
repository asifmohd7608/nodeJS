const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const { db } = require("./config/database");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3,
    },
  })
);

//connect-flash----------
app.use(flash());

//partials & helpers--------------------------
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("caps", (value) => {
  return value[0].toUpperCase();
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
hbs.registerHelper("totalAmount", function (a, b, quantity, price) {
  if (a == b) {
    return quantity * price;
  }
});
hbs.registerHelper("indexPlusOne", function (index) {
  return index + 1;
});

//for coupons category name
hbs.registerHelper("checkCategories", function (categories, Coupon_Category) {
  const reqCategory = categories.filter(
    (category) => category.id == Coupon_Category
  );
  if (reqCategory.length > 0) {
    return reqCategory[0].category_name;
  } else {
    return "all";
  }
});
hbs.registerHelper("convertTime", (time) => {
  const date = new Date(time);
  return date.toDateString();
});
hbs.registerHelper("findPrice", (cart, bookId) => {
  const uniqueCart = Object.values(
    cart.reduce((accumulator, obj) => {
      accumulator[obj.id] = obj;
      return accumulator;
    }, {})
  );

  const price = uniqueCart.map((book) => {
    if (book.id == bookId) {
      return book.price;
    }
  });
  const filteredPrice = price.filter((value) => value !== undefined);
  return filteredPrice[0];
});
hbs.registerHelper("findUnitPrice", (cart, bookId) => {
  const uniqueCart = Object.values(
    cart.reduce((accumulator, obj) => {
      accumulator[obj.id] = obj;
      return accumulator;
    }, {})
  );

  const unitPrice = uniqueCart.map((book) => {
    if (book.id == bookId) {
      return book.unitPrice;
    }
  });
  const filteredUnitPrice = unitPrice.filter((value) => value !== undefined);
  return filteredUnitPrice[0];
});
hbs.registerHelper("findPayablePrice", (cart, bookId) => {
  const uniqueCart = Object.values(
    cart.reduce((accumulator, obj) => {
      accumulator[obj.id] = obj;
      return accumulator;
    }, {})
  );

  const price = uniqueCart.map((book) => {
    if (book.id == bookId) {
      return book.payableAmount;
    }
  });
  const filteredPrice = price.filter((value) => value !== undefined);
  return filteredPrice[0];
});
hbs.registerHelper("findQuantity", (cart, bookId) => {
  const uniqueCart = Object.values(
    cart.reduce((accumulator, obj) => {
      accumulator[obj.id] = obj;
      return accumulator;
    }, {})
  );

  const quantity = uniqueCart.map((book) => {
    if (book.id == bookId) {
      return book.quantity;
    }
  });
  const filteredQuantity = quantity.filter((value) => value !== undefined);
  return filteredQuantity[0];
});
hbs.registerHelper("findDiscount", (cart, bookId) => {
  const uniqueCart = Object.values(
    cart.reduce((accumulator, obj) => {
      accumulator[obj.id] = obj;
      return accumulator;
    }, {})
  );

  const discount = uniqueCart.map((book) => {
    if (book.id == bookId) {
      return book.price - book.payableAmount;
    }
  });
  const filteredDiscount = discount.filter((value) => value !== undefined);
  return filteredDiscount[0];
});

//syncing db--------------------
try {
  // db.admin.sync({ alter: true });
  // db.books.sync({ alter: true });
  // db.customer.sync({ alter: true });
  // db.purchase.sync({ alter: true });
  // db.coupons.sync({ alter: true });
  db.sequelize.sync({ alter: true });
} catch (error) {
  console.log(error);
}

app.use(router);

app.listen(3000, () => {
  console.log("listening to port 3000");
});

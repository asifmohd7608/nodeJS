const { db } = require("../config/database");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const renderAdminLoginPage = (req, res) => {
  res.render("pages/adminLogin.hbs");
};
const renderAdminSignUpPage = (req, res) => {
  res.render("pages/adminSignUp.hbs");
};

const signInAdmin = async (req, res) => {
  console.log("inside signinadmin");
  const { Email, Password } = req.body;
  await db.admin
    .findOne({ where: { Email } })
    .then(async (data) => {
      if (!data) {
        res.render("pages/adminLogin", {
          message: "Email Id is not registered",
        });
      } else {
        const result = await bcrypt.compare(Password, data.Password);
        if (result) {
          const token = jwt.sign({ Email }, process.env.JWT_SECRET, {
            expiresIn: "72h",
          });
          res.cookie("token", token, { httpOnly: true });
        }
        // console.log(`result : ${result}`);
        result
          ? res.redirect("/books")
          : res.render("pages/adminLogin", {
              message: "Username or Password is incorrect",
            });
      }
    })
    .catch((error) => {
      res.send("error in signin admin");
    });
};
const signUpAdmin = async (req, res) => {
  await db.admin
    .findAll()
    .then(async (admins) => {
      // console.log(typeof admins);
      // console.log(Object.keys(admins).length);
      if (Object.keys(admins).length >= 1) {
        res.render("pages/adminSignUp", {
          message: "Sorry !, only one admin allowed",
        });
      } else {
        const { Email, First_Name, Last_Name, Password } = req.body;
        console.log("inside signup");
        //   const adminData = await db.admin.findAll();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        await db.admin
          .create({
            First_Name,
            Last_Name,
            Email,
            Password: hashedPassword,
          })
          .then(() => {
            const token = jwt.sign({ Email }, process.env.JWT_SECRET, {
              expiresIn: "72h",
            });
            res.cookie("token", token, { httpOnly: true });
            res.redirect("/books");
          })
          .catch((error) => {
            res.send("error in signup");
          });
      }
    })
    .catch((error) => {
      res.send("error in fetching admin in signupadmin");
    });
};

const logoutAdmin = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

//users-----------------------------------

const renderUserSignupPage = (req, res) => {
  res.render("pages/forms/userSignUp");
};
const renderUserLoginPage = (req, res) => {
  res.render("pages/forms/userLogin", { success: req.flash("success") });
};

const signUpUser = async (req, res) => {
  const { Email, First_Name, Last_Name, Address, Mobile, City, Password } =
    req.body;
  console.log({
    Email,
    First_Name,
    Last_Name,
    Address,
    Mobile,
    City,
    Password,
  });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(Password, salt);
  await db.customer
    .create({
      Email,
      First_Name,
      Last_Name,
      Address,
      City,
      Mobile,
      Password: hashedPassword,
    })
    .then(() => {
      const token = jwt.sign({ Email, First_Name }, process.env.JWT_SECRET, {
        expiresIn: "72h",
      });
      res.cookie("UserToken", token, { httpOnly: true });
      req.flash("success", "Successfully signed up");
      res.redirect("/users/purchase");
      // res.send("success in signup user");
    })
    .catch((err) => {
      console.log(err);
      res.send("error in signup");
    });

  //else encrypt password and create an account and then send a cookie and redirect to /users/purchase
};
const logInUser = async (req, res) => {
  ////////check--------------------
  const customer = await db.customer.findByPk(req.customerId); //userId from log in validation
  const userToken = jwt.sign(
    { Email: customer.Email, userName: customer.First_Name },
    process.env.JWT_SECRET
  );
  res.cookie("userToken", userToken, { expiresIn: "72h" });
  req.flash("success", "welcome");
  res.redirect("/users/purchase");
};
const logoutUser = (req, res) => {
  res.clearCookie("userToken");
  req.flash("success", "Successfully logged out");
  res.redirect("/login/user");
};

module.exports = {
  renderAdminLoginPage,
  renderAdminSignUpPage,
  signInAdmin,
  signUpAdmin,
  logoutAdmin,
  renderUserSignupPage,
  renderUserLoginPage,
  signUpUser,
  logInUser,
  logoutUser,
};

const { db } = require("../config/database");
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

module.exports = {
  renderAdminLoginPage,
  renderAdminSignUpPage,
  signInAdmin,
  signUpAdmin,
  logoutAdmin,
};

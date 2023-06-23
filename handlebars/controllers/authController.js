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
  const { Email, Password } = req.body;
  await db.admin
    .findOne({ where: { Email } })
    .then(async (data) => {
      const result = await bcrypt.compare(Password, data.Password);
      if (result) {
        const token = jwt.sign({ Email }, process.env.JWT_SECRET, {
          expiresIn: "72h",
        });
        res.cookie("token", token, { httpOnly: true });
      }
      result
        ? res.redirect("/about")
        : res.render("pages/adminLogin", {
            message: "Username or Password is incorrect",
          });
    })
    .catch((error) => {
      res.send("error in signing in");
    });
};
const signUpAdmin = async (req, res) => {
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
      res.send("success in signup");
    })
    .catch((error) => {
      res.send("error in signup");
    });
};

module.exports = {
  renderAdminLoginPage,
  renderAdminSignUpPage,
  signInAdmin,
  signUpAdmin,
};

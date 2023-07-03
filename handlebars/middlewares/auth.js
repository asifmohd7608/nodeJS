const jwt = require("jsonwebtoken");

const checkIsAdmin = async (req, res, next) => {
  const token = req.cookies?.token;
  const customerToken = req.cookies?.userToken;
  // console.log(`token : ${token}`);
  if (!token) {
    if (customerToken) {
      res.locals.name = jwt.verify(
        customerToken,
        process.env.JWT_SECRET
      ).userName; // other wise wont show user name on admin routes
      checkIsLoggedinCustomer(req, res, next);
    }
    req.originalUrl === "/signup/admin"
      ? res.render("pages/adminSignUp")
      : res.render("pages/adminLogin");
  } else {
    console.log("inside else");
    const result = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = result.Email;
    req.originalUrl === "/" || req.originalUrl === "/signup/admin"
      ? res.redirect("/books")
      : next();
  }
  // console.log(`token : ${token}`);
  // console.log(`secret jwt : ${process.env.JWT_SECRET}`);
};
const checkIsLoggedinCustomer = (req, res, next) => {
  const token = req.cookies?.userToken;
  // console.log(`token : ${token}`);
  if (!token) {
    req.originalUrl === "/signup/user"
      ? res.render("pages/forms/userSignUp")
      : res.render("pages/forms/userLogin", { success: req.flash("success") });
  } else {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.name = result.userName;
    req.Email = result.Email;
    req.originalUrl === "/signup/user" || req.originalUrl === "/login/user"
      ? res.redirect("/users/purchase")
      : req.originalUrl === "/books" ||
        req.originalUrl === "/" ||
        req.originalUrl === "/signup/admin"
      ? res.redirect("/users/purchase")
      : next();
  }
};
module.exports = { checkIsAdmin, checkIsLoggedinCustomer };

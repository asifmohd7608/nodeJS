const jwt = require("jsonwebtoken");

const checkIsAdmin = async (req, res, next) => {
  const token = req.cookies?.token;
  // console.log(`token : ${token}`);
  if (!token) {
    req.originalUrl === "/signup/admin"
      ? res.render("pages/adminSignUp")
      : res.render("pages/adminLogin");
  } else {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = result.Email;
    req.originalUrl === "/" || req.originalUrl === "/signup/admin"
      ? res.redirect("/books")
      : next();
  }
  // console.log(`token : ${token}`);
  // console.log(`secret jwt : ${process.env.JWT_SECRET}`);
};
module.exports = { checkIsAdmin };

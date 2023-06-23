const jwt = require("jsonwebtoken");

const checkIsAdmin = async (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    res.redirect("/auth/login/admin");
  }
  console.log(token);
  console.log(process.env.JWT_SECRET);
  const result = jwt.verify(token, process.env.JWT_SECRET);
  console.log(result);
  next();
};
module.exports = { checkIsAdmin };

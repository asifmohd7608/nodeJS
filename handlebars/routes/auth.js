const router = require("express").Router();
const {
  renderAdminLoginPage,
  signInAdmin,
  renderAdminSignUpPage,
  signUpAdmin,
} = require("../controllers/authController");

router.get("/login/admin", renderAdminLoginPage);
router.post("/login/admin", signInAdmin);
router.get("/signup/admin", renderAdminSignUpPage);
router.post("/signup/admin", signUpAdmin);

module.exports = router;

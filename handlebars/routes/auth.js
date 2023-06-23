const router = require("express").Router();
const {
  renderAdminLoginPage,
  signInAdmin,
  renderAdminSignUpPage,
  signUpAdmin,
  logoutAdmin,
} = require("../controllers/authController");
const { checkIsAdmin } = require("../middlewares/auth");
const { validateAuthForm } = require("../middlewares/formValidations");

router.get("/", checkIsAdmin, renderAdminLoginPage);
router.post("/", validateAuthForm, signInAdmin);
router.get("/signup/admin", checkIsAdmin, renderAdminSignUpPage);
router.post("/signup/admin", validateAuthForm, signUpAdmin);
router.get("/logout/admin", checkIsAdmin, logoutAdmin);

module.exports = router;

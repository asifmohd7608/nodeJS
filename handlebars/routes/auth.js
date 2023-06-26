const router = require("express").Router();
const {
  renderAdminLoginPage,
  signInAdmin,
  renderAdminSignUpPage,
  signUpAdmin,
  logoutAdmin,
  signUpUser,
  logInUser,
  renderUserSignupPage,
  renderUserLoginPage,
  logoutUser,
} = require("../controllers/authController");
const {
  checkIsAdmin,
  checkIsLoggedinCustomer,
} = require("../middlewares/auth");
const {
  validateAuthForm,
  validateUserSignupForm,
  validateUserLoginForm,
} = require("../middlewares/formValidations");

//admin-------------------------

router.get("/", checkIsAdmin, renderAdminLoginPage);
router.post("/", validateAuthForm, signInAdmin);
router.get("/signup/admin", checkIsAdmin, renderAdminSignUpPage);
router.post("/signup/admin", validateAuthForm, signUpAdmin);
router.get("/logout/admin", checkIsAdmin, logoutAdmin);

//user---------------------------

router.get("/signup/user", checkIsLoggedinCustomer, renderUserSignupPage);
router.post("/signup/user", validateUserSignupForm, signUpUser);
router.get("/login/user", checkIsLoggedinCustomer, renderUserLoginPage);
router.post("/login/user", validateUserLoginForm, logInUser);
router.get("/logout/user", logoutUser);

module.exports = router;

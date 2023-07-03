const app = require("express");
const router = app.Router();

const booksRoute = require("./booksRoute");
const aboutRoute = require("./aboutRoute");
const authRoute = require("./auth");
const userRoutes = require("./userRoutes");
const { checkIsAdmin } = require("../middlewares/auth");
const couponsRoute = require("../routes/couponsRoute");

router.use("/", authRoute);
router.use("/users", userRoutes);
router.use("/books", checkIsAdmin, booksRoute);
router.use("/coupons", checkIsAdmin, couponsRoute);
router.use("/about", aboutRoute);
module.exports = router;

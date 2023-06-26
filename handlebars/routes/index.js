const app = require("express");
const router = app.Router();

const booksRoute = require("./booksRoute");
const aboutRoute = require("./aboutRoute");
const authRoute = require("./auth");
const userRoutes = require("./userRoutes");
const { checkIsAdmin } = require("../middlewares/auth");

router.use("/", authRoute);
router.use("/users", userRoutes);
router.use("/books", checkIsAdmin, booksRoute);
router.use("/about", checkIsAdmin, aboutRoute);
module.exports = router;

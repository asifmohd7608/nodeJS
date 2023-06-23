const app = require("express");
const router = app.Router();

const booksRoute = require("./booksRoute");
const aboutRoute = require("./aboutRoute");
const authRoute = require("./auth");
const { checkIsAdmin } = require("../middlewares/auth");

router.use("/", authRoute);
router.use("/books", checkIsAdmin, booksRoute);
router.use("/about", checkIsAdmin, aboutRoute);
module.exports = router;

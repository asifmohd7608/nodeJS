const app = require("express");
const router = app.Router();

const booksRoute = require("./booksRoute");
const aboutRoute = require("./aboutRoute");
const authRoute = require("./auth");

router.use("/", booksRoute);
router.use("/about", aboutRoute);
router.use("/auth", authRoute);
module.exports = router;

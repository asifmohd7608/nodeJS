const router = require("express").Router();
const { renderAboutPage } = require("../controllers/aboutController");

router.get("/", renderAboutPage);

module.exports = router;

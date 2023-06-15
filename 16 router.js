const express = require("express");
const router = express.Router();
const path = require("path");

const options = {
  root: path.join(__dirname, "./html/"),
};
router.get("/", (req, res) => {
  res.sendFile("home.html", options);
});
router.get("/contact", (req, res) => {
  res.sendFile("contact.html", options);
});
router.get("/about", (req, res) => {
  res.sendFile("about.html", options);
});
router.get("*", (req, res) => {
  res.sendFile("notfound.html", options);
});
module.exports = router;

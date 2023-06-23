const express = require("express");
const path = require("path");
const app = express();
const { token } = require("./middleware/middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("Template/static"));

const options = {
  root: path.join(__dirname, "/Template"),
};

app.listen(3000, () => {
  console.log("listening on port 3000");
});

app.get("/", token, (req, res) => {
  req.token ? res.sendFile("index.html", options) : res.json({ auth: false });
});
app.get("/example", (req, res) => {
  console.log("in example page");
  console.log(req.user);
  res.send("example page");
});

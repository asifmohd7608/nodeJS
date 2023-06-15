const express = require("express");
const app = express();
const routes = require("./16 router");

app.listen(3000, () => {
  console.log("listening to port 3000");
});
app.use("/", routes);

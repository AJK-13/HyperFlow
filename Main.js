const express = require("express");
const app = express();
app.use(express.static("static"));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.render("Main", {});
  // If logged in redirect to /Flow
});
app.get("/Flow", function (req, res) {
  res.render("Flow", {});
});
app.get("*", function (req, res) {
  res.status(404).render("404");
});
app.listen(8080, () => {
  console.log("Server Started on port %d", 8080);
});

const express = require("express");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const bp = require("body-parser");
const app = express();
app.use(express.static("static"));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser("secret"));
const uri = process.env.CREDENTIALS;
app.set("view engine", "ejs");
app.listen(8080, () => {
  console.log("Server Started on port %d", 8080);
});
const cookieParams = {
  httpOnly: true,
  signed: true,
  maxAge: 2147483647
}
app.get("/", function(req, res) {
  console.log(req.signedCookies);
  if (req.signedCookies.userdata) {
  res.redirect("flow");
  } else {
  res.render("Windex", {});
  };
});
app.post("/", (req, res) => {
  if (req.body.method == "removecookie") {
    res.clearCookie("userdata", cookieParams).send();
  }
  if (req.body.method == "regular_signup") {
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      collection = client.db("HyperFlow").collection("UserData");
      console.log("Inserting User Data...");
      collection.find({ username: req.body.username }).toArray(function(err, items) {
        if (err) throw err;
        items = items[0];
        if (items) {
          console.log("Taken");
          res.json({ check: "Taken" });
        } else {
          res.cookie("userdata", req.body.username, cookieParams)
          collection.insertOne({ username: req.body.username, profilepic: req.body.profilepic, password: req.body.password }, (err, result) => {
            if (err) throw err;
            console.log("Inserted User Data!");
            console.log("Successful");
            res.json({ check: "Success" });
            client.close();
          });
        }
      });
    });
  }
  if (req.body.method == "google_signup") {
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      collection = client.db("HyperFlow").collection("UserData");
      console.log("Inserting User Data...");
      collection.find({ username: req.body.username }).toArray(function(err, items) {
        if (err) throw err;
        items = items[0];
        if (items) {
          console.log("Taken");
          res.json({ check: "Taken" });
        } else {
          res.cookie("userdata", req.body.username, cookieParams)
          collection.insertOne({ username: req.body.username, profilepic: req.body.profilepic, }, (err, result) => {
            if (err) throw err;
            console.log("Inserted User Data!");
            console.log("Successful");
            res.json({ check: "Success" });
            client.close();
          });
        }
      });
    });
  }
  if (req.body.method == "regular_login") {
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      collection = client.db("HyperFlow").collection("UserData");
      collection.find({ username: req.body.username, password: req.body.password }).toArray(function(err, items) {
        if (err) throw err;
        items = items[0];
        if (items) {
          res.cookie("userdata", req.body.username, cookieParams)
          console.log("Successful");
          res.json({ check: "Success", pic: items.profilepic })
          client.close();
        } else {
          console.log("Fail");
          res.json({ check: "Fail" });
        }
      });
    });
  }
  if (req.body.method == "google_login") {
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      collection = client.db("HyperFlow").collection("UserData");
      collection.find({ username: req.body.username }).toArray(function(err, items) {
        if (err) throw err;
        items = items[0];
        if (items) {
          res.cookie("userdata", req.body.username, cookieParams)
          console.log("Successful");
          res.json({ check: "Success" });
          client.close();
        } else {
          console.log("Fail");
          res.json({ check: "Fail" });
        }
      });
    });
  }
})
app.get("/flow", function(req, res) {
  console.log(req.signedCookies)
  if (req.signedCookies.userdata) {
  res.render("Flow", {});
  } else {
  res.redirect("404");
  };
});
app.get("/signup", function(req, res) {
  res.render("Signup", {});
});
app.get("/login", function(req, res) {
  res.render("Login", {});
});
app.get("*", function(req, res) {
  res.status(404).render("404");
});

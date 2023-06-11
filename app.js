require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "ThisIsMySecretKey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb+srv://Humza1011:Humza118056@cluster1.bgb1fvt.mongodb.net/?retryWrites=true&w=majority"
);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  secrets: [{ text: String }],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// HOME ROUTE
app.get("/", function (req, res) {
  res.status(200).render("home");
});

//  lOGIN ROUTE
app
  .route("/login")
  .get(function (req, res) {
    res.status(200).render("login");
  })
  .post(function (req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, function (err) {
      if (!err) {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      } else {
        res.send(err);
      }
    });
  });

//  REGISTER ROUTE
app
  .route("/register")
  .get(function (req, res) {
    res.status(200).render("register");
  })
  .post(function (req, res) {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          res.send(err);
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/secrets");
          });
        }
      }
    );
  });

// SECRETS ROUTE
app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    User.findOne({ _id: userId }, function (err, dbItem) {
      res.render("secrets", { secretsList: dbItem.secrets });
    });
  } else {
    res.redirect("/login");
  }
});

// PUBLIC SECRETS ROUTE
app.get("/secretsPublic", function (req, res) {
  if (req.isAuthenticated()) {
    User.find({ secrets: { $ne: [] } }, function (err, dbItems) {
      res.render("secretsPublic", { users: dbItems });
    });
  } else {
    res.redirect("/login");
  }
});

// LOGOUT ROUTE
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      res.send(err);
    }
  });
});

// SUBMIT ROUTE
app
  .route("/submit")
  .get(function (req, res) {
    if (req.isAuthenticated()) {
      res.status(200).render("submit");
    } else {
      res.redirect("/login");
    }
  })
  .post(function (req, res) {
    const secret = req.body.secret.toUpperCase();
    const userId = req.user.id;
    User.findOneAndUpdate(
      { _id: userId },
      { $push: { secrets: { text: secret } } },
      function (err, dbItem) {
        if (!err) {
          console.log(dbItem.secrets);
          res.redirect("/secrets");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(process.env.PORT || 3000, function () {
  console.log("Successfully started the server on port 3000");
});

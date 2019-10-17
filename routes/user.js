const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

//Register get route
router.get("/register", (req, res) => {
  res.render("user/register", {
    skipSpace: "YES",
    title: "Coin Inventory | Register"
  });
});

//Register Route
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (req.body.password.length < 8) {
    errors.push({ text: "Password must be at least 8 characters" });
  }
  if (errors.length > 0) {
    res.render("user/register", {
      skipSpace: "YES",
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email is already registered, please try again");
        res.redirect("register");
      } else {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          password2: req.body.password2
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

//Login get route
router.get("/login", (req, res) => {
  const err = res.locals.error[0];
  res.render("user/login", {
    failErr: err,
    skipSpace: "YES",
    title: "Coin Inventory | Login"
  });
});

//Login Form POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true
  })(req, res, next);
});

//User Home get route
router.get("/home", ensureAuthenticated, (req, res) => {
  res.render("user/home", {
    skipSpace: "YES",
    title: "Coin Inventory | home"
  });
});

//Logout user
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/user/login");
});

module.exports = router;

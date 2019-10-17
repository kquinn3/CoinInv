const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

Coin = require("../models/coin");
Category = require("../models/category");
Inventory = require("../models/inventory");
User = require("../models/user");

module.exports = router;

//User Dashboard get route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const user = req.user;
  countCoins(user).then(val => {
    let coinGroup = groupBy(val, "denomination");
    res.render("index/dashboard", {
      skipSpace: "YES",
      title: "Coin Inventory | home",
      Penny: coinGroup.Pennies,
      Nickel: coinGroup.Nickels,
      Dime: coinGroup.Dimes,
      Quarter: coinGroup.Quarters,
      HalfDollar: coinGroup.HalfDollars,
      Dollar: coinGroup.Dollars
    });
  });
});

function groupBy(arr, property) {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

//User Home get route
router.get("/", ensureGuest, (req, res) => {
  res.render("index/home", {
    title: "Coin Inventory | home",
    script: "js/page_home.js"
  });
});

//No login home Home get route
router.get("/contact", (req, res) => {
  res.render("index/contact", {
    title: "Coin Inventory | Contact",
    skipSpace: "YES"
  });
});

//About get route
router.get("/about", (req, res) => {
  res.render("index/about", {
    title: "Coin Inventory | About",
    skipSpace: "YES"
  });
});

async function countCoins(user) {
  const ca = await Inventory.find({ user: user })
    .populate("coin")
    .then(async function(inv) {
      let c = [];
      let d = {};
      const catCoin = inv.map(x => x.coin.category);
      let cats = await Category.find({}).lean();
      for (c in cats) {
        let cnt = 0;
        for (cc in catCoin) {
          if (cats[c].category == catCoin[cc]) {
            cnt++;
          }
        }
        cats[c].count = cnt;
      }
      return cats;
    });
  return ca;
}

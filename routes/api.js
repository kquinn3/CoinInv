const express = require("express");
const router = express.Router();

Coin = require("../models/coin");
Category = require("../models/category");
Denomination = require("../models/denomination");

router.get("/denominations", (req, res) => {
  Denomination.getDenominations(function(err, denominations) {
    if (err) {
      throw err;
    }
    res.json(denominations);
  });
});

router.get("/categories", (req, res) => {
  Category.getCategories(function(err, categories) {
    if (err) {
      throw err;
    }
    res.json(categories);
  });
});

router.get("/categories:denomination", (req, res) => {
  const den = req.params.denomination.split(/:/)[1];
  Category.getCategoriesByDenomination(den, function(err, categories) {
    if (err) {
      throw err;
    }
    res.json(categories);
  });
});

router.get("/coins", (req, res) => {
  Coin.getCoins(function(err, coins) {
    if (err) {
      throw err;
    }
    res.json(coins);
  });
});

router.get("/coin:id", (req, res) => {
  const ID = req.params.id.split(/:/)[1];
  Coin.findById(ID, function(err, coin) {
    res.json(coin);
  });
});

module.exports = router;

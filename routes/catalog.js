const express = require("express");
const fs = require("fs");
const Promise = require("promise");

Denomination = require("../models/denomination");
Category = require("../models/category");
Coin = require("../models/coin");

const router = express.Router();

router.get("/", function(req, res) {
  Category.find({}, (err, coin) => {
    let coinGroup = groupBy(coin, "denomination");

    res.render("catalog/catalog_index", {
      Penny: coinGroup.Pennies,
      Nickel: coinGroup.Nickels,
      Dime: coinGroup.Dimes,
      Quarter: coinGroup.Quarters,
      HalfDollar: coinGroup.HalfDollars,
      Dollar: coinGroup.Dollars,
      title: `Coin Inventory | Catalog-Categories`
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

router.get("/categories:denomination", (req, res) => {
  const den = req.params.denomination.split(/:/)[1];

  Category.getCategoriesByDenomination(den, function(err, categories) {
    if (err) {
      throw err;
    }
    let denom = den.slice(0, -1);
    if (denom === "Pennie") denom = "Penny";
    if (denom === "HalfDollar") denom = "Half Dollar";

    let dataObject = {
      title: `Coin Inventory | Catalog-${den}`,
      // script: "js/page_catalog.js",
      denom: denom,
      category: categories
    };

    res.render("catalog/catalog_categories", dataObject);
  });
});

router.get("/coins:_id", (req, res) => {
  const _id = req.params._id.split(/:/)[1];

  Category.getCategoryById(_id, function(err, category) {
    if (err) {
      throw err;
    }
    Coin.getCoinsByCategory(category.category, function(err, coin) {
      if (err) {
        throw err;
      }
      let dataObject = {
        title: `Coin Inventory | Catalog-${category.category}`,
        // script: "js/page_catalog.js",
        category: category.category,
        coin: coin
      };

      res.render("catalog/catalog_coins", dataObject);
    });
  });
});
module.exports = router;

const express = require("express");
const fs = require("fs");

Denomination = require("../models/denomination");
Category = require("../models/category");
Coin = require("../models/coin");
Inventory = require("../models/inventory");

const router = express.Router();

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
      script: "js/page_catalog.js",
      denom: denom,
      category: categories
    };
    res.render("collection/collection_categories", dataObject);
  });
});

router.get("/coins:_id", (req, res) => {
  const _id = req.params._id.split(/:/)[1];
  const user = req.user;
  Category.getCategoryById(_id, function(err, category) {
    if (err) {
      throw err;
    }
    let cat = category.category;
    FindCoins(user, cat).then(coinByCat => {
      //console.log(coinByCat);
      let dataObject = {
        title: `Coin Inventory | Collection-${category.category}`,
        script: "../js/page_collection.js",
        coin: coinByCat,
        category: cat
      };
      res.render("collection/collection_coins", dataObject);
    });
  });
});

async function FindCoins(user, category) {
  const ca = await Inventory.find({ user: user })
    .populate("coin")
    .then(async function(inv) {
      const co = await Coin.find({ category: category })
        .sort({ coinYear: 1 })
        .lean();
      for (c in co) {
        let cnt = 0;
        for (cc in inv) {
          if (inv[cc].coin._id.equals(co[c]._id)) {
            cnt++;
          }
        }
        co[c].count = cnt;
      }
      return co;
    });
  return ca;
}

//Add Coin to the collection
router.get("/add/:id", (req, res) => {
  Coin.findOne({ _id: req.params.id }).then(coin => {
    res.render("collection/collection_add", {
      skipSpace: "YES",
      title: `Coin Inventory : Add Coin`,
      coin: coin
    });
  });
});

router.post("/add/:id", (req, res) => {
  const newCollection = {
    condition: req.body.condition,
    coin: req.params.id,
    user: req.user.id
  };
  new Inventory(newCollection).save().then(() => {
    res.redirect("/dashboard");
  });
});

//Add coin through fetch without rendering
router.get("/addcoin/:passInfo", (req, res) => {
  //console.log(req.params.passInfo);
  const id = req.params.passInfo.split(/_/)[1];
  const condition = req.params.passInfo.split(/_/)[2];
  const user = req.user;
  const newCollection = {
    condition: condition,
    coin: id,
    user: user
  };
  new Inventory(newCollection).save().then(() => {
    resp = { denom: "this is a test" };
    resp = JSON.stringify(resp);
    return res.json(resp);
  });
});

router.get("/getcoins/:passInfo", (req, res) => {
  const id = req.params.passInfo.split(/:/)[1];
  const user = req.user;
  Inventory.find({ coin: id, user: user })
    .populate("coin")
    .then(coins => {
      res.json(coins);
    });
});

router.get("/delcoins/:passInfo", (req, res) => {
  const idArr = req.params.passInfo.split(/_/);
  const user = req.user;
  for (let i = 1; i < idArr.length; i++) {
    Inventory.remove({ _id: idArr[i] }).then(r => {
      if (i == idArr.length - 1) {
        resp = { denom: "this is a test" };
        resp = JSON.stringify(resp);
        return res.json(resp);
      }
    });
  }
});

router.get("/editcoins/:passInfo", (req, res) => {
  const idArr = req.params.passInfo.split(/_/);
  const user = req.user;
  for (let i = 1; i < idArr.length + 1; i += 2) {
    let update = {
      condition: idArr[i + 1]
    };
    Inventory.findOneAndUpdate({ _id: idArr[i] }, update).then(r => {
      if (i == idArr.length - 1) {
        resp = { denom: "this is a test" };
        resp = JSON.stringify(resp);
        return res.json(resp);
      }
    });
  }
});

module.exports = router;

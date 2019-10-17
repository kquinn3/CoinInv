const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

Denomination = require("../models/denomination");
Category = require("../models/category");
Coin = require("../models/coin");
Inventory = require("../models/inventory");

module.exports = router;

//Storage home get route
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("storage/storage", {
    title: "Coin Inventory | Storage",
    skipSpace: "YES"
  });
});

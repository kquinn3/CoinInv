const mongoose = require("mongoose");

//Coin Schema
const coinSchema = mongoose.Schema({
  denomination: {
    type: String,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  coinName: {
    type: String,
    require: true
  },
  coinYear: {
    type: String,
    require: true
  },
  mint: {
    type: String,
    require: true
  },
  strike: {
    type: String,
    require: true
  },
  mintage: {
    type: String,
    require: true
  },
  ngc: {
    type: String,
    require: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Coin = (module.exports = mongoose.model("Coin", coinSchema));

//Add Coin
module.exports.addCoin = function(coin, callback) {
  //console.log(coin);
  Coin.create(coin, callback);
};

//Get Coins
module.exports.getCoins = function(callback, limit) {
  //console.log(`Callback= ${callback}`);
  Coin.find(callback).limit(limit);
};

//Get Coins
module.exports.getCoinById = function(id, callback) {
  //console.log(`Callback= ${callback}`);
  Coin.findById(id, callback);
};

//Get Quarters
module.exports.getQuarters = function(callback, limit) {
  console.log("It is here");
  Coin.find({ denomination: "Quarters" }, callback).limit(limit);
};
//Get Quarter Types
module.exports.getQuarterTypes = function(callback, limit) {
  console.log("It is here");
  let query = { denomination: "Quarters" };
  Coin.distinct("category", callback);
};

//Get Coins
module.exports.getCoinsByCategory = function(cat, callback) {
  //console.log(`Callback= ${callback}`);
  const mySort = { coinYear: 1, mint: 1 };
  Coin.find({ category: `${cat}` }, callback).sort(mySort);
};

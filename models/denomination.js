const mongoose = require("mongoose");

//Denomination Schema
const denominationSchema = mongoose.Schema({
  denomination: {
    type: String,
    require: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Denomination = (module.exports = mongoose.model(
  "Denomination",
  denominationSchema
));

//Add Denomination
module.exports.addDenomination = function(denomination, callback) {
  Denomination.create(denomination, callback);
};

//Get Denomination
module.exports.getDenominations = function(callback, limit) {
  Denomination.find(callback).limit(limit);
};

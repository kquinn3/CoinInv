const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Coin Schema
const inventorySchema = mongoose.Schema({
  condition: {
    type: String,
    require: true
  },
  coin: {
    type: Schema.Types.ObjectId,
    ref: "Coin"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Collection = (module.exports = mongoose.model(
  "Inventory",
  inventorySchema
));

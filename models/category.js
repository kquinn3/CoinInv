const mongoose = require("mongoose");

//Category Schema
const categorySchema = mongoose.Schema({
  denomination: {
    type: String,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const Category = (module.exports = mongoose.model("Category", categorySchema));

//Add Category
module.exports.addCategory = function(category, callback) {
  Category.create(category, callback);
};

//Get Categories
module.exports.getCategories = function(callback, limit) {
  Category.find(callback).limit(limit);
};

//Get Categories By Denomination
module.exports.getCategoriesByDenomination = function(den, callback) {
  Category.find({ denomination: `${den}` }, callback);
};
//Get Category By Id
module.exports.getCategoryById = function(_id, callback) {
  Category.findOne({ _id: `${_id}` }, callback);
};

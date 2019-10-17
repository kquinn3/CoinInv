const mongoose = require("mongoose");

//User Schema
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

const User = (module.exports = mongoose.model("User", userSchema));

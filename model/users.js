const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: String,
  token: String,
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;

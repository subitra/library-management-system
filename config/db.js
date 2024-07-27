const config = require("config");

const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/myDatabase"; //"mongodb://localhost:27017/myDatabase";
exports.connect = () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => console.log("Connection established"))
    .catch((err) => console.log(err));
};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Book Schema
const bookSchema = new Schema({
  bookId: String,
  title: String,
  author: String,
  noOfCopies: {
    type: Number,
    default: 1,
  },
});

const bookmodel = mongoose.model("books", bookSchema);

module.exports = bookmodel;

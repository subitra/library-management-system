const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const studentSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  book: [
    {
      bookId: { type: String, ref: "book" },
      issueDate: {
        type: Date,
        Default: new Date(Date.now),
      },
      returnDate: {
        type: Date,
        Default: new Date(Date.now),
      },
      //dueDate: Date,
    },
  ],
});

const booksTaken = mongoose.model("students", studentSchema);
module.exports = booksTaken;

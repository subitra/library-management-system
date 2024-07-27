const bookModel = require("../model/books");
const booksTaken = require("../model/student");

const addBooks = async function (req, res) {
  try {
    const bookId = req.body.bookId;
    const book = await bookModel.findOneAndUpdate(
      { bookId: bookId },
      { $inc: { noOfCopies: 1 } }
    );
    if (book) return res.send("No of Copies updated");

    let data = await bookModel.create(req.body);
    data.save();

    res.send("Book Added to the database");
  } catch {
    (err) => console.log(err);
  }
};

const getBooks = async function (req, res) {
  try {
    const { username } = req.params;
    console.log(username);
    if (!username) {
      //getting all books
      let books = await bookModel.find();
      if (!books) throw new Error("No books found");
      res.send(books);
    } else {
      // getting student taken books
      const bookObj = {};
      let books = await booksTaken.find(
        { username: username },
        { "book.bookId": 1 }
      );
      console.log(books);
      console.log(books[0]["book"].length);
      const arrlength = books[0]["book"].length;
      for (var i = 0; i < arrlength; i++) {
        console.log(i);
        console.log(books[0]["book"][i]["bookId"]);
        const bDetails = await bookModel.findOne(books[0]["book"][i]["bookId"]);
        bookObj.bookId = bDetails.bookId;
        bookObj.title = bDetails.title;
        bookObj.author = bDetails.author;
      }
      console.log(bookObj);
      if (!books) throw new Error("No books found");
      res.send(books);
    }
  } catch {
    (err) => console.log(err);
  }
};

const requestBook = async function (req, res) {
  try {
    const { bookId } = req.params;
    const issueDate = new Date();
    const returnDate = new Date(+new Date() + 7 * 24 * 60 * 60 * 1000);
    const book = await bookModel.findOne({ bookId: bookId });

    if (!book) throw new Error("Enter a valid book id");

    const studentExists = await booksTaken.findOne({
      username: req.user.username,
    });

    if (!studentExists && book.noOfCopies >= 0) {
      // If the student is taking book for first time, create a document
      const bookEntry = await booksTaken.create({
        username: req.user.username,
        book: [{ bookId, issueDate, returnDate }],
      });
      // decreasing the book Copies when book is granted
      await bookModel.findOneAndUpdate(
        { bookId: bookId },
        { $inc: { noOfCopies: -1 } }
      );
      //sending the document as response
      res.send(bookEntry);
    } else if (book.noOfCopies >= 0) {
      // If student has alreasy taken few books before, then simply pushing the book details into the document
      if (!studentExists.book.some((el) => el.bookId === bookId)) {
        studentExists.book.push({ bookId, issueDate, returnDate });
        const bookEntry = await studentExists.save();
        // decreasing the book Copies when book is granted
        await bookModel.findOneAndUpdate(
          { bookId: bookId },
          { $inc: { noOfCopies: -1 } }
        );
        //sending the document as response
        res.send(bookEntry);
      } else {
        //same book cannot be requested by the same user again
        res.send("Same book cannot be requested again");
      }
    } else res.send("Book out of stock"); // If enough copies are not available then showing this
  } catch {
    (err) => console.log(err);
  }
};

const bookStatus = async function (req, res) {
  const { bookId } = req.params;
  const userType = req.user.userType;

  if (userType === "student") {
    // If the userType is the student itself then their taken book status is shown
    const studentExists = await booksTaken.findOne({
      username: req.user.username,
    });
    console.log(studentExists.book);

    const index = studentExists.book.map((e) => e.bookId).indexOf(bookId);
    if (index !== -1) res.status(200).send(studentExists.book[index]);
    else res.status(400).send("Book doesnt exists");
  } else {
    // If the userType is librarian then the bookStatus includes the students who have the particular book
    const studentsExist = await booksTaken.find({ "book.bookId": bookId });
    console.log(studentsExist.books);
    if (!studentsExist) res.send("No book exists");
    else res.send(studentsExist);
  }
};

const bookCount = async function (req, res) {
  try {
    const { bookId } = req.params;
    const book = await bookModel
      .findOne({ bookId: bookId })
      .catch((err) => console.log(err));

    const bookCount = book.noOfCopies;
    res.send("Total No of Copies of " + book.title + ": " + bookCount);
  } catch {
    (err) => console.log(err);
  }
};
module.exports = { addBooks, getBooks, requestBook, bookStatus, bookCount };

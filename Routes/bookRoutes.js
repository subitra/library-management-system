const router = require("express").Router();
const { authUser, authRole } = require("../controller/authControl");
const {
  getBooks,
  addBooks,
  requestBook,
  bookStatus,
  bookCount,
} = require("../controller/bookController");

// Passing optional userId to get user specific books when param is passed, if not all books will be displayed
router.get("/getBooks/:username?", authUser, getBooks);

router.post("/addBook", authRole(["admin", "librarian"]), addBooks);

router.get("/requestBook/:bookId", authRole("student"), requestBook);

router.get(
  "/bookStatus/:bookId",
  authRole(["librarian", "student"]),
  bookStatus
);

router.get("/bookCount/:bookId", authUser, bookCount);

module.exports = router;

const app = require("express");
const router = app.Router();
const {
  validateAddForm,
  validateEditForm,
} = require("../middlewares/formValidations");
const {
  renderAddForm,
  renderEditForm,
  addBook,
  fetchBooksData,
  editBook,
  searchBook,
  deleteBook,
} = require("../controllers/booksController");
const { upload } = require("../middlewares/fileUpload");

router.get("/", fetchBooksData);
router.post("/search", searchBook);
router.get("/addbook", renderAddForm);
router.post("/addbook", upload.single("file"), validateAddForm, addBook);
router.get("/editbook/:id", renderEditForm);
router.post("/editbook/:id", upload.single("file"), validateEditForm, editBook);
router.get("/delete/:id", deleteBook);

module.exports = router;

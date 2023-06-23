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
} = require("../controllers/booksController");
const { upload } = require("../middlewares/fileUpload");

router.get("/", fetchBooksData);
router.get("/addbook", renderAddForm);
router.post("/addbook", upload.single("file"), validateAddForm, addBook);
router.get("/editbook/:id", renderEditForm);
router.post("/editbook/:id", upload.single("file"), validateEditForm, editBook);

module.exports = router;

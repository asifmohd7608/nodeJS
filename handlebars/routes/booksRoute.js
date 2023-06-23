const app = require("express");
const router = app.Router();
const {
  validateAddForm,
  validateEditForm,
} = require("../middlewares/formValidations");
const { checkIsAdmin } = require("../middlewares/auth");
const {
  renderAddForm,
  renderEditForm,
  addBook,
  fetchBooksData,
  editBook,
} = require("../controllers/booksController");

router.get("/", checkIsAdmin, fetchBooksData);
router.get("/addbook", checkIsAdmin, renderAddForm);
router.post("/addbook", checkIsAdmin, validateAddForm, addBook);
router.get("/editbook/:id", checkIsAdmin, renderEditForm);
router.post("/editbook/:id", checkIsAdmin, validateEditForm, editBook);

module.exports = router;

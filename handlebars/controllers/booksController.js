const { db } = require("../config/database");
const { Op } = require("sequelize");

const fetchBooksData = async (req, res) => {
  try {
    const fetchedData = await db.books.findAll({ include: db.category });
    const categories = await db.category.findAll();

    fetchedData
      ? res.render("pages/books", { fetchedData, categories })
      : res.send("error");
  } catch (err) {
    res.send("error");
  }
};
const searchBook = async (req, res) => {
  const { Book_Title = "", Category_Type = "" } = req.body;
  const categories = await db.category.findAll();
  const formData = { Book_Title, Category_Type };
  await db.books
    .findAll({
      where: {
        Book_Title: { [Op.like]: `%${Book_Title}%` },
        Category_Type: { [Op.like]: `%${Category_Type}%` },
      },
      include: db.category,
    })
    .then((fetchedData) => {
      res.render("pages/books", { fetchedData, categories, formData });
    })
    .catch((err) => {
      console.log(err);
      res.send("error");
    });
};
const renderAddForm = async (req, res) => {
  try {
    const categories = await db.category.findAll();
    categories
      ? res.render("pages/addForm", { categories })
      : res.send("error");
  } catch (err) {
    res.send("error");
  }
};
const renderEditForm = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await db.category.findAll();
    const data = await db.books.findByPk(id);
    data
      ? res.render("pages/editForm", {
          data,
          categories,
          bCategory: data.Category_Type,
        })
      : res.send("error");
    // res.send({ categories, data });
  } catch (err) {
    res.send("error");
  }
};
const addBook = async (req, res) => {
  const {
    Book_Title,
    ISBN,
    Author,
    Publication_Year,
    Language,
    Category_Type,
    No_Of_Copies_Actual,
    No_Of_Copies_Current,
    Price,
    Available,
  } = req.body;
  try {
    const data = await db.books.create({
      ISBN,
      Book_Title,
      Author,
      Publication_Year,
      Language,
      No_Of_Copies_Actual,
      No_Of_Copies_Current,
      Available,
      Price,
      Category_Type,
      File_Path: `uploads/books/images/${req.file.filename}`,
    });
    data ? res.redirect("/") : res.json({ success: false });
  } catch (error) {
    res.send("error");
  }
};
const editBook = async (req, res) => {
  const { id } = req.params;
  const {
    ISBN,
    Book_Title,
    Author,
    Publication_Year,
    Language,
    No_Of_Copies_Actual,
    No_Of_Copies_Current,
    Available,
    Price,
    Category_Type,
  } = req.body;
  const updatedData = {
    ISBN,
    Book_Title,
    Author,
    Publication_Year,
    Language,
    No_Of_Copies_Actual,
    No_Of_Copies_Current,
    Available,
    Price,
    Category_Type,
  };
  if (req?.file?.filename) {
    updatedData.File_Path = `uploads/books/images/${req.file.filename}`;
  }
  try {
    const data = await db.books.update(updatedData, { where: { id } });
    data ? res.redirect("/books") : res.send("error");
  } catch (err) {
    res.send("error in route");
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = db.books.destroy({ where: { id } });
    req.flash("success", "successfully deleted Book");
    res.redirect("/");
  } catch (error) {
    res.send("error in deleteBook");
  }
};

module.exports = {
  renderAddForm,
  renderEditForm,
  addBook,
  fetchBooksData,
  editBook,
  searchBook,
  deleteBook,
};

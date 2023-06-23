const { validationResult, body } = require("express-validator");
const { db } = require("../config/database");
const fs = require("fs");

const errorHandler = (req, res, next, view, errors, data) => {
  console.log(errors);
  res.render(view, {
    errors,
    data,
    categories: data.categories,
    categoryType: data.Category_Type,
  });
};

const validateAddForm = [
  body("ISBN")
    .notEmpty()
    .withMessage("ISBN field cant be empty")
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage("ISBN length should be exactly 10"),
  body("Book_Title")
    .notEmpty()
    .withMessage("Book title field cant be empty")
    .bail()
    .isLength({ min: 5, max: 30 })
    .withMessage(
      "Book title should be minimum 5 and maximum 30 characters long"
    ),
  body("Author")
    .notEmpty()
    .withMessage("Author name cant be empty")
    .bail()
    .isLength({ min: 5, max: 30 })
    .withMessage(
      "Author name should be minimum 5 and maximum 30 characters long"
    ),
  body("Language")
    .notEmpty()
    .withMessage("Language field cant be empty")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Language should be minimum 4 characters long"),
  body("Publication_Year").custom((value) => {
    const dateFromForm = new Date(value).getTime();
    const currentDate = new Date().getTime();
    if (currentDate < dateFromForm) {
      throw new Error("Published date cant be a future date");
    } else {
      return true;
    }
  }),
  body("No_Of_Copies_Actual")
    .notEmpty()
    .withMessage("No of Actual Copies field cant be empty")
    .bail()
    .custom((value, { req }) => {
      if (!parseInt(value) >= 1) {
        throw new Error("Actual copies cant be less than 1");
      } else if (parseInt(value) < req.body.No_Of_Copies_Current) {
        throw new Error(
          "Actual copies value cant be less than available copies value"
        );
      } else {
        return true;
      }
    }),
  body("No_Of_Copies_Current")
    .notEmpty()
    .withMessage("No of Current Copies field cant be empty")
    .bail()
    .custom((value, { req }) => {
      if (!parseInt(value) >= 1) {
        throw new Error("Current copies cant be less than 1");
      } else if (parseInt(value) > req.body.No_Of_Copies_Actual) {
        throw new Error(
          "current copies value cant be greater than actual copies value"
        );
      } else {
        return true;
      }
    }),
  body("Price")
    .notEmpty()
    .withMessage("Price field cant be empty")
    .bail()
    .custom((value) => {
      if (value < 50) {
        throw new Error("Price should be minimum 50 Rs");
      } else {
        return true;
      }
    }),
  body("Available").custom((value, { req }) => {
    const { No_Of_Copies_Current: current } = req.body;
    if (current == 0 && parseInt(value) == 1) {
      throw new Error("Availability cant be in stock as current value is 0");
    } else if (parseInt(current) > 0 && value == 0) {
      throw new Error(
        `Availability cant be out of stock as current value is ${current}`
      );
    } else {
      return true;
    }
  }),
  body("file").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Please upload an image for book cover");
    } else {
      return true;
    }
  }),
  async (req, res, next) => {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length > 0) {
      //code to delete uploaded file
      fs.unlink(`public/uploads/books/images/${req?.file?.filename}`, (err) => {
        if (err) {
          console.log(err);
          console.log("error removing file");
        } else {
          console.log("removed file");
        }
      });

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
      const formData = {
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
      };
      await db.category
        .findAll()
        .then((categories) => {
          formData.categories = categories;
          errorHandler(req, res, next, "pages/addForm", errors, formData);
        })
        .catch((err) => {
          res.send("error");
        });
    } else {
      next();
    }
  },
];

const validateEditForm = [
  body("ISBN")
    .notEmpty()
    .withMessage("ISBN field cant be empty")
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage("ISBN length should be exactly 10"),
  body("Book_Title")
    .notEmpty()
    .withMessage("Book title field cant be empty")
    .bail()
    .isLength({ min: 5, max: 30 })
    .withMessage(
      "Book title should be minimum 5 and maximum 30 characters long"
    ),
  body("Author")
    .notEmpty()
    .withMessage("Author name cant be empty")
    .bail()
    .isLength({ min: 5, max: 30 })
    .withMessage(
      "Author name should be minimum 5 and maximum 30 characters long"
    ),
  body("Language")
    .notEmpty()
    .withMessage("Language field cant be empty")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Language should be minimum 4 characters long"),
  body("Publication_Year").custom((value) => {
    const dateFromForm = new Date(value).getTime();
    const currentDate = new Date().getTime();
    if (currentDate < dateFromForm) {
      throw new Error("Published date cant be a future date");
    } else {
      return true;
    }
  }),
  body("No_Of_Copies_Actual")
    .notEmpty()
    .withMessage("No of Actual Copies field cant be empty")
    .bail()
    .custom((value, { req }) => {
      if (!parseInt(value) >= 1) {
        throw new Error("Actual copies cant be less than 1");
      } else if (parseInt(value) < req.body.No_Of_Copies_Current) {
        throw new Error(
          "Actual copies value cant be less than available copies value"
        );
      } else {
        return true;
      }
    }),
  body("No_Of_Copies_Current")
    .notEmpty()
    .withMessage("No of Current Copies field cant be empty")
    .bail()
    .custom((value, { req }) => {
      if (parseInt(value) > req.body.No_Of_Copies_Actual) {
        throw new Error(
          "current copies value cant be greater than actual copies value"
        );
      } else {
        return true;
      }
    }),
  body("Price")
    .notEmpty()
    .withMessage("Price field cant be empty")
    .bail()
    .custom((value) => {
      if (value < 50) {
        throw new Error("Price should be minimum 50 Rs");
      } else {
        return true;
      }
    }),
  body("Available").custom((value, { req }) => {
    const { No_Of_Copies_Current: current } = req.body;
    if (current == 0 && value == 1) {
      throw new Error("Availability cant be in stock as current value is 0");
    } else if (parseInt(current) > 0 && value == 0) {
      throw new Error(
        `Availability cant be out of stock as current value is ${current}`
      );
    } else {
      return true;
    }
  }),
  body("file").custom(async (value, { req }) => {
    const { id } = req.params;
    const bookData = await db.books.findByPk(id);
    const path = bookData?.File_Path;
    console.log(`edit : ${req.file} ${path}`);
    if (!req.file && !path) {
      console.log(`req.file : ${req.file}`);
      throw new Error("Please upload an image for book cover");
    } else if (req.file && path) {
      throw new Error("Only one image required, please remove an image");
    } else {
      return true;
    }
  }),
  async (req, res, next) => {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length > 0) {
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
      const { id } = req.params;

      const formData = {
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
      };
      await db.category
        .findAll()
        .then((categories) => {
          formData.categories = categories;
          formData.id = id;
          errorHandler(req, res, next, "pages/editForm", errors, formData);
        })
        .catch((err) => {
          res.send("error");
        });
    } else {
      next();
    }
  },
];
const validateAuthForm = [
  body("Email")
    .notEmpty()
    .withMessage("Email field cant be empty")
    .bail()
    .isEmail()
    .withMessage("Invalid Email format"),
  (req, res, next) => {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length > 0) {
      if (req.originalUrl === "/") {
        res.render("pages/adminLogin", { errors });
      } else {
        res.render("pages/adminSignUp", { errors });
      }
    } else {
      next();
    }
  },
];
module.exports = { validateAddForm, validateEditForm, validateAuthForm };

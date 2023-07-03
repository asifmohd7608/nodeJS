const { validationResult, body } = require("express-validator");
const { db } = require("../config/database");
const bcrypt = require("bcrypt");
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
      } else if (parseInt(value) < 0) {
        throw new Error("please enter a positive value");
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
      } else if (parseInt(value) < 0) {
        throw new Error("please enter a positive value");
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
    if (!req.file && !path) {
      console.log(`req.file : ${req.file}`);
      throw new Error("Please upload an image for book cover");
    } else if (req.file && path) {
      fs.unlink(`public/${path}`, (err) => {
        if (err) {
          console.log(err);
          console.log("error removing file");
        } else {
          console.log("removed file");
        }
      });
      return true;
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
          res.send("error in validation");
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

const validateUserSignupForm = [
  body("First_Name")
    .notEmpty()
    .withMessage("This field cant be empty")
    .bail()
    .isString()
    .withMessage("this field value should be of alphabets"),
  body("Last_Name")
    .notEmpty()
    .withMessage("This name field cant be empty")
    .bail()
    .isString()
    .withMessage("this field value should be of alphabets"),
  body("Address")
    .notEmpty()
    .withMessage("This name field cant be empty")
    .bail()
    .isString()
    .withMessage("this field value should be of alphabets"),
  body("City")
    .notEmpty()
    .withMessage("this field cant be empty")
    .bail()
    .isString()
    .withMessage("this field value should be of alphabets"),
  body("Password").notEmpty().withMessage("this field cant be empty").bail(),

  body("Email")
    .notEmpty()
    .withMessage("Email id cant be empty")
    .bail()
    .isEmail()
    .withMessage("invalid email id")
    .custom(async (value, { req }) => {
      // console.log(`email : ${value}`);

      const customers = await db.customer.findAll({
        where: {
          Email: value,
        },
      });

      if (customers.length < 1) {
        return true;
      } else {
        throw new Error("This email is already registered");
      }
    }),

  body("Mobile")
    .notEmpty()
    .withMessage("This name field cant be empty")
    .bail()
    .isNumeric()
    .withMessage("this field value should be Integers")
    .custom(async (value, { req }) => {
      console.log(`mobile : ${value}`);
      const customers = await db.customer.findAll({
        where: {
          Mobile: value,
        },
      });

      if (customers.length < 1) {
        return true;
      } else {
        throw new Error("This Mobile Number is already registered");
      }
    }),

  (req, res, next) => {
    const errors = validationResult(req).mapped();
    console.log(`errors in user signup :`);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      const { Email, First_Name, Last_Name, Address, Mobile, City, Password } =
        req.body;
      const formData = {
        Email,
        First_Name,
        Last_Name,
        Address,
        Mobile,
        City,
      };
      res.render("pages/forms/userSignUp", { errors, formData });
    } else {
      next();
    }
  },
];

const validateUserLoginForm = [
  body("Email")
    .notEmpty()
    .withMessage("Email id cant be empty")
    .bail()
    .custom(async (value, { req }) => {
      const customer = await db.customer.findAll({ where: { Email: value } });
      if (!customer.length > 0) {
        throw new Error("email id is incorrect");
      } else {
        return true;
      }
    }),
  body("Password")
    .notEmpty()
    .withMessage("Password field cant be empty")
    .bail()
    .custom(async (value, { req }) => {
      const customer = await db.customer.findAll({
        where: { Email: req.body.Email },
      });
      if (customer.length < 1) {
        throw new Error("Invalid email Id or password");
      }
      console.log("before result");
      const result = await bcrypt.compare(value, customer[0].Password);
      console.log("after result");

      if (!result) {
        throw new Error("Invalid email Id or password");
      } else {
        req.customerId = customer[0].id;
        return true;
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req).mapped();
    console.log(errors);
    const { Email } = req.body;
    const formData = { Email };
    if (Object.keys(errors).length > 0) {
      res.render("pages/forms/userLogin", { errors, formData });
    } else {
      next();
    }
  },
];

const validateCouponCreateForm = [
  body("Name")
    .notEmpty()
    .withMessage("Coupon name can't be empty")
    .bail()
    .isString()
    .withMessage("Coupon name should be of strings")
    .bail()
    .isLength({ min: 4, max: 15 })
    .withMessage("Coupon name should be 4 to 15 characters long")
    .custom(async (value, { req }) => {
      const result = await db.coupons.findOne({ where: { Name: value } });
      if (result) {
        throw new Error("A coupon with the same name already exists");
      } else {
        return true;
      }
    }),
  body("Code")
    .notEmpty()
    .withMessage("Code can't be empty")
    .bail()
    .isString()
    .withMessage("Code should be of strings")
    .bail()
    .isLength({ min: 4, max: 15 })
    .withMessage("Code should be 4 to 15 characters long")
    .custom(async (value, { req }) => {
      const result = await db.coupons.findOne({ where: { Code: value } });
      if (result) {
        throw new Error("A coupon with the same code already exists");
      } else {
        return true;
      }
    }),
  body("Coupon_Offer")
    .notEmpty()
    .withMessage("coupon offer value can't be empty")
    .bail()
    .isNumeric()
    .withMessage("coupon offer value should be a number")
    .bail()
    .isLength({ min: 1, max: 5 })
    .withMessage("coupon offer value should be 1 to 5"),
  body("Coupon_Type")
    .notEmpty()
    .withMessage("Coupon type value can't be empty")
    .bail()
    .custom((value, { req }) => {
      if (value !== "Percentage" && value !== "Fixed") {
        throw new Error("Coupon type should be either Percentage or Fixed");
      } else {
        return true;
      }
    }),
  body("Coupon_Status").notEmpty().withMessage("Coupon Status can't be empty"),
  body("file").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Please upload a coupon image");
    } else {
      return true;
    }
  }),
  body("Validity_Start")
    .notEmpty()
    .withMessage("Validity start field can't be empty")
    .bail()
    .isDate()
    .withMessage("Incorrect date format")
    .bail()
    .custom((value, { req }) => {
      console.log(`start ${value} , type : ${typeof value}`);
      const validityStartDateInMs = new Date(value).getTime();
      //today
      const today = new Date();
      const currentTime = today.getTime();
      today.setHours(0, 0, 0, 0);
      const todayInMs = today.getTime();

      //tommorrow
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      tomorrow.setHours(0, 0, 0, 0);
      const tommorrowInMs = tomorrow.getTime();

      console.log(`validity start date in ms  : ${validityStartDateInMs}`);
      console.log(`current time in ms  : ${currentTime}`);
      console.log(`tommorrow in ms  : ${tommorrowInMs}`);
      if (validityStartDateInMs - todayInMs < 0) {
        throw new Error("validity start date can't be a past date");
      } else if (validityStartDateInMs - todayInMs < 24 * 60 * 60 * 1000) {
        throw new Error(
          "validity start date can't be the same date as coupon creation date"
        );
      } else {
        return true;
      }
    }),
  body("Validity_End")
    .notEmpty()
    .withMessage("Validity end field can't be empty")
    .bail()
    .isDate()
    .withMessage("Incorrect date format")
    .bail()
    .custom((value, { req }) => {
      const validityStartDate = req.body.Validity_Start;
      const validityStartDateInMs = new Date(validityStartDate).getTime();
      const validityEndDateInMs = new Date(value).getTime();
      //today
      const today = new Date();
      const currentTime = today.getTime();
      today.setHours(0, 0, 0, 0);
      const todayInMs = today.getTime();

      //tommorrow
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      tomorrow.setHours(0, 0, 0, 0);
      if (validityEndDateInMs === validityStartDateInMs) {
        throw new Error(
          "validity end date and Start date can't be the same date"
        );
      } else if (validityEndDateInMs - currentTime < 0) {
        throw new Error("validity end date can't be a past date");
      } else {
        return true;
      }
    }),
  body("Coupon_Category")
    .notEmpty()
    .withMessage("Coupon category can't be empty"),
  async (req, res, next) => {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      const {
        Name,
        Code,
        Coupon_Offer,
        Coupon_Type,
        Validity_Start,
        Validity_End,
        Coupon_Category,
        Coupon_Status,
      } = req.body;
      // const fileName=req.file.filename
      const formData = {
        Name,
        Code,
        Coupon_Offer,
        Coupon_Type,
        Validity_Start,
        Validity_End,
        Coupon_Category,
        Coupon_Status,
      };
      if (req.file) {
        fs.unlink(`public/uploads/coupons/${req?.file?.filename}`, (err) => {
          if (err) {
            console.log(err);
            console.log("error removing file");
          } else {
            console.log("removed file");
          }
        });
      }
      const categories = await db.category.findAll();
      res.render("pages/forms/couponcreateform", {
        errors,
        formData,
        categories,
      });
    } else {
      next();
    }
  },
];

const validateCouponEditForm = [
  body("Name")
    .notEmpty()
    .withMessage("Coupon name can't be empty")
    .bail()
    .isString()
    .withMessage("Coupon name should be of strings")
    .bail()
    .isLength({ min: 4, max: 15 })
    .withMessage("Coupon name should be 4 to 15 characters long")
    .custom(async (value, { req }) => {
      const result = await db.coupons.findOne({ where: { Name: value } });
      if (result) {
        if (result.id != req.params.id)
          throw new Error("A coupon with the same name already exists");
      } else {
        return true;
      }
    }),
  body("Code")
    .notEmpty()
    .withMessage("Code can't be empty")
    .bail()
    .isString()
    .withMessage("Code should be of strings")
    .bail()
    .isLength({ min: 4, max: 15 })
    .withMessage("Code should be 4 to 15 characters long")
    .custom(async (value, { req }) => {
      const result = await db.coupons.findOne({ where: { Code: value } });
      if (result) {
        if (result.id != req.params.id)
          throw new Error("A coupon with the same code already exists");
      } else {
        return true;
      }
    }),
  body("Coupon_Offer")
    .notEmpty()
    .withMessage("coupon offer value can't be empty")
    .bail()
    .isNumeric()
    .withMessage("coupon offer value should be a number")
    .bail()
    .isLength({ min: 1, max: 5 })
    .withMessage("coupon offer value should be 1 to 5"),
  body("Coupon_Type")
    .notEmpty()
    .withMessage("Coupon type value can't be empty")
    .bail()
    .custom((value, { req }) => {
      if (value !== "Percentage" && value !== "Fixed") {
        throw new Error("Coupon type should be either Percentage or Fixed");
      } else {
        return true;
      }
    }),
  body("Coupon_Status").notEmpty().withMessage("Coupon Status can't be empty"),
  body("Validity_Start")
    .notEmpty()
    .withMessage("Validity start field can't be empty")
    .bail()
    .isDate()
    .withMessage("Incorrect date format")
    .bail()
    .custom((value, { req }) => {
      console.log(`start ${value} , type : ${typeof value}`);
      const validityStartDateInMs = new Date(value).getTime();
      //today
      const today = new Date();
      const currentTime = today.getTime();
      today.setHours(0, 0, 0, 0);
      const todayInMs = today.getTime();

      //tommorrow
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      tomorrow.setHours(0, 0, 0, 0);
      const tommorrowInMs = tomorrow.getTime();

      console.log(`validity start date in ms  : ${validityStartDateInMs}`);
      console.log(`current time in ms  : ${currentTime}`);
      console.log(`tommorrow in ms  : ${tommorrowInMs}`);
      if (validityStartDateInMs - todayInMs < 0) {
        throw new Error("validity start date can't be a past date");
      } else if (validityStartDateInMs - todayInMs < 24 * 60 * 60 * 1000) {
        throw new Error(
          "validity start date can't be the same date as coupon creation date"
        );
      } else {
        return true;
      }
    }),
  body("Validity_End")
    .notEmpty()
    .withMessage("Validity end field can't be empty")
    .bail()
    .isDate()
    .withMessage("Incorrect date format")
    .bail()
    .custom((value, { req }) => {
      const validityStartDate = req.body.Validity_Start;
      const validityStartDateInMs = new Date(validityStartDate).getTime();
      const validityEndDateInMs = new Date(value).getTime();
      //today
      const today = new Date();
      const currentTime = today.getTime();
      today.setHours(0, 0, 0, 0);
      const todayInMs = today.getTime();

      //tommorrow
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      tomorrow.setHours(0, 0, 0, 0);
      if (validityEndDateInMs === validityStartDateInMs) {
        throw new Error(
          "validity end date and Start date can't be the same date"
        );
      } else if (validityEndDateInMs - currentTime < 0) {
        throw new Error("validity end date can't be a past date");
      } else {
        return true;
      }
    }),

  async (req, res, next) => {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      const {
        Name,
        Code,
        Coupon_Offer,
        Coupon_Type,
        Validity_Start,
        Validity_End,
        Coupon_Category,
        Coupon_Status,
      } = req.body;
      const formData = {
        Name,
        Code,
        Coupon_Offer,
        Coupon_Type,
        id: req.params.id,
        Validity_Start,
        Validity_End,
        Coupon_Category,
        Coupon_Status,
      };
      const categories = await db.category.findAll();

      res.render("pages/admin/couponeditform", {
        errors,
        formData,
        categories,
      });
    } else {
      next();
    }
  },
];
module.exports = {
  validateAddForm,
  validateEditForm,
  validateAuthForm,
  validateUserSignupForm,
  validateUserLoginForm,
  validateCouponCreateForm,
  validateCouponEditForm,
};

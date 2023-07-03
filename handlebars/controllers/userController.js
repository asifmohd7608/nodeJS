const { db } = require("../config/database");
const { Op } = require("sequelize");

const renderPurchaseList = async (req, res) => {
  try {
    const books = await db.books.findAll({ where: { Available: 1 } });
    res.render("pages/purchaseBooks", { books, success: req.flash("success") });
  } catch (error) {
    res.send("failed to fetch books in renderpurchase list");
  }
};
const sortByBooksPrice = async (req, res) => {
  const { min, max } = req.body;
  const formData = { min, max };
  try {
    const sortedBooks = await db.books.findAll({
      where: { Price: { [Op.between]: [min, max] }, Available: 1 },
    });
    res.render("pages/purchaseBooks", { books: sortedBooks, formData });
  } catch (error) {
    res.send("error in sorting");
  }
};
const addToCart = (req, res) => {
  const { bookId } = req.params;
  let cart = req.session?.cart;
  if (!cart || cart.length < 1) {
    req.session.cart = [];
    const book = { id: bookId, quantity: 1 };
    req.session.cart.push(book);
  } else {
    cart.filter((book) => {
      if (book.id == bookId) {
        book.quantity += 1;
      } else {
        const book = { id: bookId, quantity: 1 };
        req.session.cart.push(book);
      }
    });
  }
  // console.log(cart);
  // console.log(req.flash);
  req.flash("success", "added to cart");
  res.redirect("/users/purchase");
};

const changeQuantity = async (req, res) => {
  const { bookId, action } = req.params;
  let cart = req.session?.cart;
  if (cart?.length < 1) {
    res.send("cant change quantity since cart doesnt exist");
  } else {
    const reqBook = await db.books.findByPk(bookId);
    cart.forEach(async (book) => {
      if (bookId === book.id && action === "add") {
        if (reqBook.No_Of_Copies_Current > book.quantity) {
          book.quantity += 1;
        }
      } else if (bookId === book.id && action === "reduce") {
        if (book.quantity === 1) {
          book.quantity = 1;
          return;
        } else {
          book.quantity -= 1;
        }
      }
    });
    // console.log(cart);
    req.session.cart = cart;
    res.redirect("/users/cart/show");
  }
};

const renderCart = async (req, res) => {
  let cart = req.session?.cart;
  // console.log(`cart : ${cart}`);
  if (cart?.length > 0) {
    const bookIds = cart.map((book) => {
      return book.id;
    });
    // console.log(`book ids : ${bookIds}`);
    await db.books
      .findAll({ where: { id: bookIds }, include: db.category })
      .then((books) => {
        res.render("pages/cart", {
          books,
          cart,
          success: req.flash("success"),
        });
        // res.send(books);
      })
      .catch((err) => {
        res.send("error in rendercart");
      });
  } else {
    res.render("pages/cart", { cart: [], success: req.flash("success") });
  }
};
const deleteFromCart = (req, res) => {
  const { id } = req.params;
  const cart = req.session?.cart;

  if (!cart) {
    res.send("no cart found");
  } else {
    const newCart = cart.filter((book) => book.id !== id);
    req.session.cart = newCart;
    req.flash("success", "Successfully cleared from cart");
    res.redirect("/users/cart/show");
  }
};

const deleteCart = (req, res) => {
  req.session.cart = [];
  req.flash("success", "Successfully cleared cart");
  res.redirect("/users/cart/show");
};

const renderOrderPage = async (req, res) => {
  const reqCustomer = await db.customer.findAll({
    where: { Email: req.Email },
  });
  await db.purchase
    .findAll({
      where: { Customer_Id: reqCustomer[0].id },
      include: {
        model: db.books,
        required: true,
        attributes: ["File_Path", "Book_Title", "Price"],
      },
    })
    .then((data) => {
      // res.send(data);
      res.render("pages/orders", {
        orders: data,
        success: req.flash("success"),
      });
    })
    .catch((err) => {
      res.send("error in renderOrderPage");
    });

  // res.render("pages/orders");
};
const checkoutCart = async (req, res) => {
  const cart = req.session?.cart;
  const promises = [];
  if (cart) {
    cart.forEach(async (book) => {
      const reqBook = await db.books.findByPk(book.id);
      const reqCustomer = await db.customer.findAll({
        where: { Email: req.Email },
      });
      const promise = await db.purchase.create({
        Purchase_Count: book.quantity,
        Amount: book.quantity * reqBook.Price,
        Customer_Id: reqCustomer[0].id,
        Book_Id: reqBook.id,
      });
      const removeQuantityFromDb = await db.books.update(
        {
          No_Of_Copies_Current: reqBook.No_Of_Copies_Current - book.quantity,
          Available: reqBook.No_Of_Copies_Current - book.quantity <= 0 ? 0 : 1,
        },
        { where: { id: book.id } }
      );
      promises.push(promise, removeQuantityFromDb);
    });
    Promise.all([...promises])
      .then((data) => {
        req.session.cart = [];
        req.flash("success", "Successfully placed the order");
        res.redirect("/users/orders");
      })
      .catch((err) => {
        res.send("error in checkoutcart");
      });
  } else {
    res.redirect("/users/cart/show");
  }
};

module.exports = {
  renderPurchaseList,
  sortByBooksPrice,
  addToCart,
  renderCart,
  changeQuantity,
  deleteFromCart,
  deleteCart,
  renderOrderPage,
  checkoutCart,
};

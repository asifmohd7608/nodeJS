const router = require("express").Router();
const { checkIsLoggedinCustomer } = require("../middlewares/auth");
const {
  renderPurchaseList,
  addToCart,
  renderCart,
  changeQuantity,
  deleteFromCart,
  deleteCart,
  renderOrderPage,
  checkoutCart,
  sortByBooksPrice,
} = require("../controllers/userController");

router.get("/purchase", checkIsLoggedinCustomer, renderPurchaseList);
router.post("/purchase/sort", checkIsLoggedinCustomer, sortByBooksPrice);
router.get("/orders", checkIsLoggedinCustomer, renderOrderPage);
router.get("/cart/show", checkIsLoggedinCustomer, renderCart);
router.get("/cart/add/:bookId", checkIsLoggedinCustomer, addToCart);
router.get(
  "/cart/add/:bookId/:action",
  checkIsLoggedinCustomer,
  changeQuantity
);
router.get("/cart/:id/delete", checkIsLoggedinCustomer, deleteFromCart);
router.get("/cart/delete", checkIsLoggedinCustomer, deleteCart);
router.get("/cart/checkout", checkIsLoggedinCustomer, checkoutCart);

module.exports = router;

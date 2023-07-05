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
  fetchCoupons,
  applyCoupon,
  removeCoupon,
} = require("../controllers/userController");

router.get("/purchase", checkIsLoggedinCustomer, renderPurchaseList);
router.post("/purchase/sort", checkIsLoggedinCustomer, sortByBooksPrice);
router.get("/orders", checkIsLoggedinCustomer, renderOrderPage);
router.get("/cart/show", checkIsLoggedinCustomer, renderCart);
router.get("/cart/add/:bookId", checkIsLoggedinCustomer, addToCart);
router.get(
  "/cart/add/:bookId/:couponId/:action",
  checkIsLoggedinCustomer,
  changeQuantity
);
router.get("/cart/:id/delete", checkIsLoggedinCustomer, deleteFromCart);
router.get("/cart/delete", checkIsLoggedinCustomer, deleteCart);
router.get("/cart/checkout", checkIsLoggedinCustomer, checkoutCart);
router.get("/fetchcoupons/:id", fetchCoupons);
router.post("/cart/applycoupon/:couponId", applyCoupon);
router.get("/cart/removecoupon/:bookId", removeCoupon);

module.exports = router;

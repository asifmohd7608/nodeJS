const router = require("express").Router();
const { renderPurchaseList } = require("../controllers/userController");
const { checkIsLoggedinCustomer } = require("../middlewares/auth");

router.get("/purchase", checkIsLoggedinCustomer, renderPurchaseList);
// router.get('/cart',renderCart)

module.exports = router;

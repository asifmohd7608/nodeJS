const router = require("express").Router();
const { couponImageUpload } = require("../middlewares/fileUpload");
const {
  renderCouponsTable,
  renderCouponEditForm,
  renderCouponAddForm,
  createCoupon,
  updateCoupon,
  changeCouponStatus,
} = require("../controllers/couponsController");
const {
  validateCouponCreateForm,
  validateCouponEditForm,
} = require("../middlewares/formValidations");

router.get("/", renderCouponsTable);
router.get("/create", renderCouponAddForm);
router.post(
  "/create",
  couponImageUpload.single("file"),
  validateCouponCreateForm,
  createCoupon
);
router.get("/edit/:id", renderCouponEditForm);
router.post(
  "/edit/:id",
  couponImageUpload.single("file"),
  validateCouponEditForm,
  updateCoupon
);
router.get("/changestatus/:id", changeCouponStatus);

module.exports = router;

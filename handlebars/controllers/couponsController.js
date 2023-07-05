const { db } = require("../config/database");
const fs = require("fs");

const renderCouponsTable = async (req, res) => {
  try {
    const coupons = await db.coupons.findAll();
    const categories = await db.category.findAll();
    res.render("pages/admin/coupons", { coupons, categories });
  } catch (error) {
    console.log(error);
    res.send("error in fetching coupons");
  }
};
const renderCouponEditForm = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await db.category.findAll();
    const coupon = await db.coupons.findByPk(id);
    res.render("pages/admin/couponeditform", { formData: coupon, categories });
  } catch (error) {
    console.log(error);
    res.send("error in renderCouponEditForm");
  }
};
const renderCouponAddForm = async (req, res) => {
  const categories = await db.category.findAll();
  res.render("pages/forms/couponcreateform", { categories });
};

const createCoupon = async (req, res) => {
  const {
    Name,
    Code,
    Coupon_Offer,
    Coupon_Type,
    Coupon_Status,
    Validity_Start,
    Validity_End,
    Coupon_Category,
  } = req.body;
  try {
    const result = await db.coupons.create({
      Name,
      Code,
      Coupon_Offer,
      Coupon_Type,
      Image_Path: `/uploads/coupons/${req.file.filename}`,
      Coupon_Status,
      Validity_Start,
      Validity_End,
      Coupon_Category,
    });
    res.redirect("/coupons");
  } catch (error) {
    console.log(error);
    res.send("error in coupon creation");
  }
};

const updateCoupon = async (req, res) => {
  const {
    Name,
    Code,
    Coupon_Offer,
    Coupon_Type,
    Coupon_Status,
    Coupon_Category,
  } = req.body;
  const { id } = req.params;
  const updatedData = {
    Name,
    Code,
    Coupon_Offer,
    Coupon_Type,
    Coupon_Status,
    Coupon_Category,
  };
  if (req.file) {
    updatedData.Image_Path = `/uploads/coupons/${req?.file?.filename}`;
  }
  try {
    const coupon = await db.coupons.findByPk(id);
    const reqCoupon = await db.coupons.update(updatedData, { where: { id } });
    if (req.file) {
      fs.unlink(`public${coupon.Image_Path}`, (err) => {
        if (err) {
          console.log(err);
          throw new Error("error deleting file");
        } else {
          console.log("removed file");
        }
      });
    }

    res.redirect("/coupons");
  } catch (error) {
    console.log(error);
    res.send("error in update coupon");
  }
};

const changeCouponStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await db.coupons.findByPk(id);
    const statusUpdate = {};
    if (coupon.Coupon_Status == 0) {
      statusUpdate.Coupon_Status = 1;
    } else {
      statusUpdate.Coupon_Status = 0;
    }
    const result = await db.coupons.update(statusUpdate, { where: { id } });
    res.redirect("/coupons");
  } catch (error) {
    console.log(error);
    res.send("error in deleteCoupon");
  }
};

module.exports = {
  renderCouponsTable,
  renderCouponEditForm,
  renderCouponAddForm,
  createCoupon,
  updateCoupon,
  changeCouponStatus,
};

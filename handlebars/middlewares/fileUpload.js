const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/books/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/coupons");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const couponImageUpload = multer({ storage: storage2 });

module.exports = { upload, couponImageUpload };

const { db } = require("../config/database");

const renderPurchaseList = async (req, res) => {
  try {
    const books = await db.books.findAll();
    res.render("pages/purchaseBooks", { books });
  } catch (error) {
    res.send("failed to fetch books in renderpurchase list");
  }
};

module.exports = { renderPurchaseList };

var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  let products = await Product.find({ _id: { $in: cart } });

  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  res.render("site/cart", { products, total });
});

// the add to cart function
router.get("/add-cart/:id", function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  req.flash("success", "Product Added To Cart");
  res.redirect("/");
});

router.get("/add-to-cart/:prodID", function (req, res, next) {
  if (!cart) {cart = []}
  cart.push(req.params.prodID);
  //let products = await Product.find({ _id: { $in: cart } });
  console.log("nomi CART Route, adding product = " + cart)
  res.cookie("cart", cart); // loading cart into cookie
});

module.exports = router;

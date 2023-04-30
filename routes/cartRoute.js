const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
} = require("../services/cartService");
const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(AuthService.protect, AuthService.allowedTo("user"), getLoggedUserCart)
  .post(AuthService.protect, AuthService.allowedTo("user"), addProductToCart)
  .delete(AuthService.protect, AuthService.allowedTo("user"), clearCart);

router
  .route("/changeQuantity")
  .put(
    AuthService.protect,
    AuthService.allowedTo("user"),
    updateCartItemQuantity
  );

router
  .route("/:itemId")
  .delete(AuthService.protect, AuthService.allowedTo("user"), removeCartItem);

router.put(
  "/applyCoupon",
  AuthService.protect,
  AuthService.allowedTo("user"),
  applyCoupon
);

module.exports = router;

const express = require("express");
const AuthService = require("../services/authService");
const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");

const router = express.Router();

//router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(
    AuthService.protect,
    AuthService.allowedTo("user"),
    getLoggedUserWishlist
  )
  // .get(getBrands)
  .post(
    AuthService.protect,
    AuthService.allowedTo("user"),
    addProductToWishlist
  );

router.delete(
  "/:productId",
  AuthService.protect,
  AuthService.allowedTo("user"),
  deleteProductFromWishlist
);

module.exports = router;

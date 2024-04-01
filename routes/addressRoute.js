const express = require("express");
const AuthService = require("../services/authService");
const {
  addAddress,
  deleteAddress,
  getLoggedUserAddresses,
} = require("../services/addressService");

const router = express.Router();

//router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(
    AuthService.protect,
    AuthService.allowedTo("user"),
    getLoggedUserAddresses
  )
  // .get(getBrands)
  .post(AuthService.protect, AuthService.allowedTo("user"), addAddress);

router.delete(
  "/:addressId",
  AuthService.protect,
  AuthService.allowedTo("user"),
  deleteAddress
);

module.exports = router;

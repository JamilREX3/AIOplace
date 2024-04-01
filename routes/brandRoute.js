const express = require("express");
const {
  createBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
  updateBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
  resizeImage,
  uploadBrandImage,
  filterBrandThatBelongToSpecificCat,
} = require("../services/brandService");
const AuthService = require("../services/authService");

const router = express.Router();

//router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(filterBrandThatBelongToSpecificCat, getBrands)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router.route("/:id").get(getBrandValidator, getBrand);
router
  .route("/:id")
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  );
router
  .route("/:id")
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;

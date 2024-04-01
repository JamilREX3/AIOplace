const express = require("express");
const AuthService = require("../services/authService");
const reviewRoute = require("../routes/reviewRoute");

const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  resizeProductImages,
  uploadProductImages,
  getProductsSizes,
} = require("../services/productService");
const {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} = require("../utils/validators/productValidation");

const router = express.Router();

router.get("/sizes/:categoryId", getProductsSizes);

router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(AuthService.protect, getProducts)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router.route("/:id").get(getProductValidator, getProduct);
router
  .route("/:id")
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  );
router
  .route("/:id")
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;

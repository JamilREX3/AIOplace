const express = require("express");

const {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} = require("../services/couponService");
const AuthService = require("../services/authService");

// const cc = require("./cc");

const router = express.Router();

//router.use("/:categoryId/subcategories", subCategoryRoute);

// router.post("/cc", cc);

router
  .route("/")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    getCoupons
  )
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    createCoupon
  );
router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    getCoupon
  );
router
  .route("/:id")
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    updateCoupon
  );
router
  .route("/:id")
  .delete(AuthService.protect, AuthService.allowedTo("admin"), deleteCoupon);

module.exports = router;

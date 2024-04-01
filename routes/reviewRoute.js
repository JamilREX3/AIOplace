const express = require("express");
const {
  createReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
  updateReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  createReview,
  deleteReview,
  updateReview,
  getReview,
  getReviews,
  createFilterObject,
  setProductIdToBody,
} = require("../services/reviewService");
const AuthService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    AuthService.protect,
    AuthService.allowedTo("user"),
    setProductIdToBody,
    createReviewValidator,
    createReview
  );
router.route("/:id").get(getReviewValidator, getReview);

router.put(
  "/:id",
  AuthService.protect,
  AuthService.allowedTo("user"),
  updateReviewValidator,
  updateReview
);

router
  .route("/:id")
  .delete(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;

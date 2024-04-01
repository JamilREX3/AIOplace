const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Review = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratings value must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom((value, { req }) =>
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((value, { req }) =>
      Review.findById(value).then((review) => {
        if (!review) {
          return Promise.reject(new Error("There is no review with this id"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("you can't update review not belong to you")
          );
        }
      })
    ),
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short title name")
    .isLength({ max: 72 })
    .withMessage("Too long title name"),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((value, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(value).then((review) => {
          if (!review) {
            return Promise.reject(new Error("There is no review with this id"));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("you can't update review not belong to you")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];

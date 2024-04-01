const Review = require("../models/reviewModel");
const factory = require("../utils/handlerFactory");

// configure nested route on GET
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};

  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObj = filterObject;
  next();
};

// configure nested route on CREATE
exports.setProductIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.getReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

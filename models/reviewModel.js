const mongoose = require("mongoose");
const Product = require("../models/productModel");

const reviewScheme = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min rating is 1.0"],
      max: [5, "Max rating is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewScheme.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profileImg" });
  next();
});

reviewScheme.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // stage 1 : getAllReviews in specific product
    {
      $match: { product: productId },
    },
    // stage 2 : grouping reviews based on productIda and calculate avg & quantity
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewScheme.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewScheme.post("deleteOne", { document: true }, async function () {
  console.log("ssssssssssssssssssssssssss");
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

//mongoose.model("Review", reviewScheme).findByIdAndRemove

module.exports = mongoose.model("Review", reviewScheme);

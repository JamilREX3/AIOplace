const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
//const ApiError = require("../utils/apiError");

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // add product to wishlist without repeating
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product added to wishlist successfully",
    data: user.wishlist,
  });
});

exports.deleteProductFromWishlist = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      // remove product from wishlist without repeating
      $pull: { wishList: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product removed from wishlist successfully",
  });
});

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});

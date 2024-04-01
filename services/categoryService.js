const Category = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel");

const fs = require("fs");
const path = require("path");
// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}`;
  // Save the buffer to a file
  const filePath = path.join(__dirname, "..", "uploads", filename);
  fs.writeFileSync(filePath, req.file.buffer);
  // Upload the file to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    public_id: filename,
    folder: "categories",
  });
  console.log(uploadResult);
  req.body.image = `${uploadResult.public_id}.${uploadResult.format}`;
  next();
});

// orderSchema.pre(/^find/, function (next) {
//   this.populate([
//     {
//       path: "user",
//       select: "name profileImg email phone",
//     },
//     {
//       path: "cartItems.product",
//       select: "title imageCover",
//     },
//   ]);
//   next();
// });

//top 6 depend on products count
exports.getTop6Categories = asyncHandler(async (req, res, next) => {
  const topCategories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 6,
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    //populate
    {
      $unwind: "$category",
    },
    //changes root and format
    {
      $replaceRoot: { newRoot: "$category" },
    },
  ]);

  res.status(200).json({ data: topCategories });
});

exports.getCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);

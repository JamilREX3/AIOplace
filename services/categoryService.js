const Category = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const cloudinary = require("cloudinary").v2;

const fs = require("fs");
const path = require("path");
// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}`;
  const result = await sharp(req.file.buffer)
    .toFormat("webp")
    .webp({ quality: 90 })
    .toBuffer();
  // Save the buffer to a file
  const filePath = path.join(__dirname, "..", "uploads", filename);
  fs.writeFileSync(filePath, result);
  // Upload the file to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    public_id: filename,
    folder: "categories",
  });
  console.log(uploadResult);
  req.body.image = `${uploadResult.public_id}.${uploadResult.format}`;
  next();
});

exports.getCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);

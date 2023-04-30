const Category = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const {uploadSingleImage}= require('../middlewares/uploadImageMiddleware');

// upload single image
exports.uploadCategoryImage = uploadSingleImage('image');
// image processing and optimizing
exports.resizeImage = asyncHandler(async(req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await  sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
  req.body.image= filename;
  // save images in database
  // req.body.image= 'categories/'+filename;
  next();
});

exports.getCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);

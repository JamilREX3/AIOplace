const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Brand = require("../models/brandModel");
const factory = require("../utils/handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// image processing and optimizing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${filename}`);
    // save images in database
    req.body.image = filename;
  }
  next();
});

exports.getBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);

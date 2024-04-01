const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Brand = require("../models/brandModel");
const factory = require("../utils/handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// upload single image
exports.uploadBrandImage = uploadSingleImage("image");
const cloudinary = require("cloudinary").v2;

const fs = require("fs");
const path = require("path");

exports.filterBrandThatBelongToSpecificCat = asyncHandler(
  async (req, res, next) => {
    if (req.body.categoryId) {
      req.filterObj = { categories: req.body.categoryId };
    }
    next();
  }
);

// image processing and optimizing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `brand-${uuidv4()}-${Date.now()}`;
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
      folder: "brands",
    });
    console.log(uploadResult);
    // save images in database
    req.body.image = `${uploadResult.public_id}.${uploadResult.format}`;
  }
  next();
});

exports.getBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);

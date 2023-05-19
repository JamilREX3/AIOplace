const Product = require("../models/productModel");
const factory = require("../utils/handlerFactory");
const multer = require("multer");
const ApiError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const fs = require("fs");
const path = require("path");
const { mongo, default: mongoose } = require("mongoose");
const cloudinary = require("cloudinary").v2;

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.getProductsSizes = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const sizes = await Product.aggregate([
    {
      $match: { category: new mongoose.Types.ObjectId(categoryId) },
    },
    {
      $unwind: "$sizes",
    },
    {
      $group: {
        _id: null,
        sizes: { $addToSet: "$sizes" },
      },
    },
    {
      $project: {
        _id: 0,
        sizes: 1,
      },
    },
  ]);
  // console.log(sizes);
  const uniqueSizes = sizes[0].sizes;

  // Sort the uniqueSizes array
  uniqueSizes.sort((a, b) => {
    // Split the strings by space
    const aParts = a.split(" ");
    const bParts = b.split(" ");

    // Compare the first parts numerically
    const firstPartComparison = parseInt(aParts[0]) - parseInt(bParts[0]);
    if (firstPartComparison !== 0) {
      return firstPartComparison;
    }

    // If the first parts are equal, compare the second parts numerically
    return parseInt(aParts[1]) - parseInt(bParts[1]);
  });

  // console.log(`uniqueSizes : ${uniqueSizes}`);
  res.status(200).json({ data: uniqueSizes });
});

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover`;
    const result = await sharp(req.files.imageCover[0].buffer)
      .toFormat("webp")
      .webp({ quality: 90 })
      .toBuffer();
    // Save the buffer to a file
    const filePath = path.join(__dirname, "..", "uploads", imageCoverFileName);
    fs.writeFileSync(filePath, result);
    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: imageCoverFileName,
      folder: "products",
    });
    console.log(uploadResult);
    req.body.imageCover = `${uploadResult.public_id}.${uploadResult.format}`;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}`;
        const result = await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toBuffer();
        // Save the buffer to a file
        const filePath = path.join(__dirname, "..", "uploads", imageName);
        fs.writeFileSync(filePath, result);
        // Upload the file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          public_id: imageName,
          folder: "products",
        });
        console.log(uploadResult);
        // save in DB
        req.body.images.push(
          `${uploadResult.public_id}.${uploadResult.format}`
        );
      })
    );
  }
  next();
});

exports.getProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, "reviews brand subcategories");
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

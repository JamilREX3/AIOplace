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

//best performance
// exports.resizeProductImages =asyncHandler(  async (req, res, next) => {
//   const promises = [];
//   if (req.files.imageCover) {
//     const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
//     const imageCoverPromise = sharp(req.files.imageCover[0].buffer)
//         .resize(2000, 1333)
//         .toFormat("jpeg")
//         .jpeg({ quality: 95 })
//         .toFile(`uploads/products/${imageCoverFileName}`)
//         .then(() => {
//           req.body.imageCover = imageCoverFileName;
//         });
//     promises.push(imageCoverPromise);
//   }
//
//   if (req.files.images) {
//     req.body.images = [];
//     req.files.images.forEach((img, index) => {
//       const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
//       const imagePromise = sharp(img.buffer)
//           .resize(2000, 1333)
//           .toFormat("jpeg")
//           .jpeg({ quality: 95 })
//           .toFile(`uploads/products/${imageName}`)
//           .then(() => {
//             req.body.images.push(imageName);
//           });
//       promises.push(imagePromise);
//     });
//   }
//
//   await Promise.all(promises);
//
//   console.log(req.body.imageCover);
//   console.log(req.body.images);
//   next();
// });

// exports.resizeProductImages = asyncHandler(async (req, res, next) => {
//   if (req.files.imageCover) {
//     const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
//     await sharp(req.files.imageCover[0].buffer)
//       .resize(2000, 1333)
//       .toFormat("jpeg")
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/products/${imageCoverFileName}`);
//     req.body.imageCover = imageCoverFileName;
//   }
//   if (req.files.images) {
//     req.body.images = [];
//     await Promise.all(
//       req.files.images.map(async (img, index) => {
//         const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
//         await sharp(img.buffer)
//           .resize(2000, 1333)
//           .toFormat("jpeg")
//           .jpeg({ quality: 95 })
//           .toFile(`uploads/products/${imageName}`);
//         // save in DB
//         req.body.images.push(imageName);
//       })
//     );
//   }

//   next();
// });

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

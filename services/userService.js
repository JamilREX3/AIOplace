const User = require("../models/userModel");
const factory = require("../utils/handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");
// image processing and optimizing
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}`;
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
      folder: "users",
    });
    console.log(uploadResult);
    // save images in database
    req.body.profileImg = `${uploadResult.public_id}.${uploadResult.format}`;
  }
  next();
});
// exports.resizeUserImage = asyncHandler(async (req, res, next) => {
//   if (req.file) {
//     const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat("jpeg")
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/users/${filename}`);
//     // save images in database
//     req.body.profileImg = filename;
//   }
//   next();
// });
exports.getUsers = factory.getAll(User);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    next(new ApiError("no document exist match with this id", 404));
  } else {
    res.status(201).json({ data: document });
  }
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 2),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    next(new ApiError("no document exist match with this id", 404));
  } else {
    res.status(201).json({ data: document });
  }
});

exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getLoggedUserDate = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// update user password depend on user payload
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 2),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.updateLoggedUserDate = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    { new: true }
  );

  res.status(201).json({ data: updatedUser });
});

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).send();
});

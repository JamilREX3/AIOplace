const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email is already used"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      } else {
        return true;
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "ar-SY"])
    .withMessage("please insert just syrian and Saudian Phone Numbers"),

  check("passwordConfirm").notEmpty().withMessage("password confirm required"),

  check("role").optional(),
  check("profileImg").optional(),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  //check("id").isMongoId().withMessage("Invalid user id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("ypu must enter your current password required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you should enter the password confirm"),
  check("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.id);

      if (req.body.password !== req.body.passwordConfirm) {
        throw new Error("doesn't match password confirm");
      }

      if (!user) {
        throw new Error("there is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("incorrect current password");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email is already used"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "ar-SY"])
    .withMessage("please insert just syrian and Saudian Phone Numbers"),
  check("role").optional(),
  check("profileImg").optional(),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email address format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email is already used"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "ar-SY"])
    .withMessage("please insert just syrian and Saudian Phone Numbers"),
  check("role").optional(),
  check("profileImg").optional(),
  validatorMiddleware,
];

exports.updateLoggedUserPasswordValidator = [
  //check("id").isMongoId().withMessage("Invalid user id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter your current password required"),
  check("password")
    .notEmpty()
    .withMessage("you must enter new password")
    .custom(async (value, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("there is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("incorrect current password");
      }
      return true;
    }),
  validatorMiddleware,
];

const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail() //
    .withMessage("Invalid Email address format")
    .custom((val, { req }) => {
      console.log(`val : ${val}`);
      console.log(`req.body : ${req.body}`);
      console.log(JSON.stringify(req.body));
      return true;
    }),
  check("password").notEmpty().withMessage("Password is required"),
  validatorMiddleware,
];

exports.signupValidator = [
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
  check("passwordConfirm").notEmpty().withMessage("password confirm required"),
  validatorMiddleware,
];

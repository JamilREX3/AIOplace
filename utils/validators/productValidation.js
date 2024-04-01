const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { Types } = require("mongoose");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const slugify = require("slugify");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters")
    .notEmpty()
    .withMessage("Product title required"),
  check("description")
    .notEmpty()
    .withMessage("Product description required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage("product price after discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("price after discount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be array of Strings"),
  // todo : uncomment image cover validation
  //check("imageCover").notEmpty().withMessage("Product image cover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("images should a array of string"),
  check("category")
    .notEmpty()
    .withMessage("product must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) => {
      return Category.findById(categoryId)
        .then((category) => {
          if (!category) {
            return Promise.reject(
              new Error(`no category for this id: ${categoryId}`)
            );
          }
        })
        .catch((error) => {
          return Promise.reject(new Error(`Error finding category: ${error}`));
        });
    }),

  check("subcategories")
    .optional()
    // .isMongoId()
    .isArray()
    .withMessage("subcategory must be an array of strings")
    .custom((value) => {
      if (value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          if (!Types.ObjectId.isValid(value[i])) {
            throw new Error("subcategory must contain valid MongoDB IDs");
          }
        }
      }
      return true;
    })
    .custom((subCategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subCategoriesIds } }).then(
        (result) => {
          // console.log(result);
          if (result.length < 1 || result.length !== subCategoriesIds.length) {
            return Promise.reject(new Error("Invalid subcategories Ids"));
          }
        }
      )
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subcategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subcategoriesIdsInDB.push(subCategory._id.toString());
          });
          // console.log(subcategoriesIdsInDB);
          if (!value.every((v) => subcategoriesIdsInDB.includes(v))) {
            return Promise.reject(
              new Error(
                "all Subcategories ids must belong to specific category"
              )
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid ID format"),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("rating average must be a number")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("rating must be below or equal 5"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("rating quantity must be a number"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val);
      }
      return true;
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

const SubCategory = require("../models/subCategoryModel");
const factory = require("../utils/handlerFactory");

// configure nested route on CREATE
exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// configure nested route on GET
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  console.log(req.params);
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObj = filterObject;
  next();
};

exports.getSubCategories = factory.getAll(SubCategory);
exports.getSubCategory = factory.getOne(SubCategory);
exports.createSubCategory = factory.createOne(SubCategory);
exports.updateSubCategory = factory.updateOne(SubCategory);
exports.deleteSubCategory = factory.deleteOne(SubCategory);

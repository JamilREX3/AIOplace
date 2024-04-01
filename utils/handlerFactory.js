const asyncHandler = require("express-async-handler");
const ApiError = require("./apiError");
const ApiFeatures = require("./apiFeatures");
const productModel = require("../models/productModel");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const myDocument = await Model.findByIdAndDelete(id);
    if (!myDocument) {
      next(new ApiError("no document exist match with this id", 404));
    }
    myDocument.deleteOne();
    res.status(204).json({ msg: "deleted successfully" });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      next(new ApiError("no document exist match with this id", 404));
    }
    // trigger 'save' when update the document (for reviews)
    await document.save();
    res.status(201).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    let query = Model.findById(id);

    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    //execute query

    const document = await query;

    if (!document) {
      next(new ApiError("This document is not exist", 404));
      //res.status(404).json({ msg: "This category is not exist" });
    } else {
      res.status(200).json({ data: document });
    }
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .searching()
      .filter()
      .limitFields()
      .sorting()
      .paginate(documentsCount);
    const { mongooseQuery, paginationResult } = apiFeatures;
    let documents = await mongooseQuery;

    // check if the user is logged in
    if (req.user && Model === productModel) {
      // convert documents to plain JavaScript objects
      documents = documents.map((document) => document.toObject());

      // loop through each document
      documents.forEach((document) => {
        // check if the document is in the user's wishlist
        if (req.user.wishlist.includes(document._id)) {
          // set the isInWishList field to true
          document.isInWishList = true;
        } else {
          // set the isInWishList field to false
          document.isInWishList = false;
        }
      });
    }

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

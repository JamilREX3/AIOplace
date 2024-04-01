const multer = require("multer");
// // eslint-disable-next-line import/no-extraneous-dependencies
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    console.log("**********************");
    console.log(file.mimetype);
    console.log("**********************");

    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images Allowed", 400), false);
    }
  };
  return multer({ storage: multerStorage, fileFilter: multerFilter });
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

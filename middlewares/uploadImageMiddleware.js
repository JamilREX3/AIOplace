const multer = require("multer");
// eslint-disable-next-line import/no-extraneous-dependencies
const aws = require("aws-sdk");
// eslint-disable-next-line import/no-extraneous-dependencies
const multerS3 = require("multer-s3");
const ApiError = require("../utils/apiError");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const multerOptions = () => {
  const multerStorage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `images/${Date.now().toString()}-${file.originalname}`);
    },
  });
  const multerFilter = function (req, file, cb) {
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

// const multerOptions = () => {
//   const multerStorage = multer.memoryStorage();
//   const multerFilter = function (req, file, cb) {
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb(new ApiError("Only images Allowed", 400), false);
//     }
//   };
//   return multer({ storage: multerStorage, fileFilter: multerFilter });
// };

// exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
// exports.uploadMixOfImages = (arrayOfFields) =>
//   multerOptions().fields(arrayOfFields);

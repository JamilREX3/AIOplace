const ApiError = require("../utils/apiError");
const multer = require("multer");


const multerOptions = ()=>{
    const multerStorage = multer.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new ApiError("Only images Allowed", 400), false);
        }
    };
    return multer({storage: multerStorage, fileFilter: multerFilter});
}

exports.uploadSingleImage = (fieldName)=>multerOptions().single(fieldName);
exports.uploadMixOfImages = (arrayOfFields)=> multerOptions().fields(arrayOfFields);
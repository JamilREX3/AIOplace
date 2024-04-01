const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer({ dest: "uploads/" });

const {
  createCashOrder,
  filterOrderForLoggedUser,
  getAllOrders,
  getSpecificOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
} = require("../services/orderService");
const AuthService = require("../services/authService");
const uploadImage = require("../middlewares/test");

const router = express.Router();

// //router.use("/:categoryId/subcategories", subCategoryRoute);

// cloudinary.config({
//   cloud_name: "dsaube2fg",
//   api_key: "235483313461132",
//   api_secret: "nGbkgBvV5GT36pArdboXCd94xqs",
// });

// router.post("/upload", upload.single("image"), (req, res) => {
//   const file = req.file.path;
//   cloudinary.uploader.upload(
//     file,
//     { public_id: "test0000", folder: "ggggggggg" },
//     (error, result) => {
//       if (error) {
//         res.status(500).send(error);
//       } else {
//         res.status(200).send(result);
//       }
//     }
//   );
// });

router.get(
  "/",
  AuthService.protect,
  AuthService.allowedTo("admin", "manager", "user"),
  filterOrderForLoggedUser,
  getAllOrders
);

router.get(
  "/:id",
  AuthService.protect,
  AuthService.allowedTo("admin", "manager", "user"),
  //filterOrderForLoggedUser,
  getSpecificOrder
);

router
  .route("/:cartId")
  .post(AuthService.protect, AuthService.allowedTo("user"), createCashOrder);

//order id
router.put(
  "/:id/pay",
  AuthService.protect,
  AuthService.allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  AuthService.protect,
  AuthService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;

const express = require("express");

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

//router.use("/:categoryId/subcategories", subCategoryRoute);

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

// router.put(
//   "test",
//   uploadImage.single("image"), // our uploadImage middleware
//   (req, res, next) => {
//     /* 
//          req.file = { 
//            fieldname, originalname, 
//            mimetype, size, bucket, key, location
//          }
//       */
//     // location key in req.file holds the s3 url for the image
//     const data = {};
//     if (req.file) {
//       data.image = req.file.location;
//     }
//     next();
//     // HERE IS YOUR LOGIC TO UPDATE THE DATA IN DATABASE
//   }
// );

module.exports = router;

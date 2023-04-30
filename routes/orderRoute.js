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

module.exports = router;

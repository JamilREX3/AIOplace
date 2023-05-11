const express = require("express");
const {
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  updateLoggedUserValidator,
  updateLoggedUserPasswordValidator,
} = require("../utils/validators/userValidator");

const {
  createUser,
  deleteUser,
  resizeUserImage: resizeImage,
  getUsers,
  updateUser,
  getUser,
  uploadUserImage,
  changeUserPassword,
  getLoggedUserDate,
  updateLoggedUserPassword,
  updateLoggedUserDate,
  deleteLoggedUserData,
} = require("../services/userService");
const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, changeUserPassword);

router.route("/me").get(AuthService.protect, getLoggedUserDate, getUser);
router.put(
  "/changeMyPassword",
  AuthService.protect,
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  "/changeMe",
  AuthService.protect,
  uploadUserImage,
  resizeImage,
  updateLoggedUserValidator,
  updateLoggedUserDate
);
router.delete("/deleteMe", AuthService.protect, deleteLoggedUserData);

router
  .route("/")
  .get(AuthService.protect, AuthService.allowedTo("admin", "manager"), getUsers)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router.route("/:id").get(getUserValidator, getUser);
router
  .route("/:id")
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    updateUserValidator,
    uploadUserImage,
    resizeImage,
    updateUser
  );
router
  .route("/:id")
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;

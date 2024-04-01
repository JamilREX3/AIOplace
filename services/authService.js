const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// const generateToken = (payload) => {
//   return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRE_TIME,
//   });
// };
//fg

exports.signup = asyncHandler(async (req, res, next) => {
  // todo create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // todo generate token
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token: token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token: token });
});

// make sure that user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("you are not login to get access this route", 401)
    );
  }

  // verify token (no change happens , not expired token)

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // check if user exists with the id that came from token payload

  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError(
        "the user that belong to this token doesn't longer exist",
        401
      )
    );
  }
  // check if user change his password after toke created

  if (currentUser.passwordChangeAt) {
    // converting date to timestamp
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    //password changed after token created(error)
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError("User recently changed his password, please login again"),
        401
      );
    }
  }

  req.user = currentUser;
  next();
});

// user permissions [admin, manager]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // access roles
    // access registered user
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// forget password (user send his email and we send 6 digits)
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // get user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("There is no user with that email"));
  }
  // if user exist , generate reset hash random 6 digits and save it in DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashResetCode;
  // add expiration time to reset code
  user.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  // save hashed reset code in DB
  await user.save();
  // send the reset code via email
  //const message = `Hi ${user.name},\nWe received a request to reset the password on your AIO Place Account. \n${resetCode}\n Enter this code to complete the reset.\nAIO Place Support team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "AIO place code(valid for 10 min)",
      message: resetCode,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpired = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "reset code sent tom email" });
});
// verify password (user send 6 digits in a request and we checked it)
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // get user based on reset code

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // Reset code valid
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "success" });
  //
  //
});
// reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //
  //
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with this email"), 404);
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpired = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  const token = generateToken(user._id);
  res.status(200).json({ token });
});

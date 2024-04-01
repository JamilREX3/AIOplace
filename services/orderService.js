const asyncHandler = require("express-async-handler");
const factory = require("../utils/handlerFactory");
const ApiError = require("../utils/apiError");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// create cash Order
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //////////////////////////////// App Settings  ////////////////////////////////
  // const taxPrice = 3;
  // const shippingPrice = 10;
  //////////////////////////////// App Settings  ////////////////////////////////
  // get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("There is no cart with this id"));
  }
  // get order price depend on cart price(check if coupon applied)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  // create Order with default payment method(cash)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    // totalOrderPrice: cartPrice + taxPrice + shippingPrice,
    totalOrderPrice: cartPrice,
  });
  console.log("prrrrrrrrrice : ");
  console.log(cartPrice);
  // after creating order, decrement product quantity , increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
  }
  // clear cart depend on cartId
  await Cart.findByIdAndDelete(req.params.cartId);
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  console.log("kkk");
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

exports.getAllOrders = factory.getAll(Order);
exports.getSpecificOrder = factory.getOne(Order);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isPaid: true,
      paidAt: Date.now(),
    },
    { new: true }
  );
  if (!order) {
    return next(new ApiError("there is no such order for this user", 404));
  }
  res.status(200).json({ status: "success", data: order });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    { new: true }
  );
  if (!order) {
    return next(new ApiError("there is no such order for this user", 404));
  }
  res.status(200).json({ status: "success", data: order });
});

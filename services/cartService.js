const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    const price = item.priceAfterDiscount || item.price;
    totalPrice += price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, size, quantity } = req.body;

  let cart;
  const [product, cartResult] = await Promise.all([
    Product.findById(productId),
    Cart.findOne({ user: req.user._id }),
  ]);
  cart = cartResult;

  // Check if product has priceAfterDiscount
  const price = product.priceAfterDiscount || product.price;

  if (!cart) {
    // create cart for this user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          size,
          price,
          quantity: quantity,
        },
      ],
    });
  } else {
    // product exist is cart (just update the quantity)
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );
    console.log(productIndex);
    // product exist : just refresh the quantity
    if (productIndex > -1) {
      // catch and handle old item
      const cartItem = cart.cartItems[productIndex];
      // increase its quantity

      if (quantity) {
        cartItem.quantity += quantity;
      } else {
        cartItem.quantity += 1;
      }
      // replace with updated quantity
      cart.cartItems[productIndex] = cartItem;
    }
    // if product doesn't exist
    else {
      // product not exist : push product to cart directly
      cart.cartItems.push({
        product: productId,
        color,
        size,
        quantity: quantity,
        price,
      });
    }
  }

  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    result: cart.cartItems.length,
    message: "product added to cart successfully",
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "cartItems.product",
    select: "title imageCover",
  });
  //this.populate({ path: "user", select: "name profileImg" });
  if (!cart) {
    return next(new ApiError("there is no cart for this user"));
  }
  res.status(200).json({ result: cart.cartItems.length, data: cart });
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { itemId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this user"));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );
  if (itemIndex === -1) {
    return next(new ApiError("product not found in cart"));
  }

  const cartItem = cart.cartItems[itemIndex];
  cartItem.quantity = quantity;
  cart.cartItems[itemIndex] = cartItem;
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    result: cart.cartItems.length,
    status: "success",
    message: "cart item quantity updated successfully",
    data: cart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    {
      new: true,
    }
  );
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    result: cart.cartItems.length,
    status: "success",
    message: "item removed successfully",
    data: cart,
  });

  //   if (!cart) {
  //     return next(new ApiError("there is no cart for this user"));
  //   }

  //   const updatedCartItems = cart.cartItems.filter(
  //     (item) => item._id.toString() !== itemId
  //   );
  //   if (cart.cartItems.length === updatedCartItems.length) {
  //     return next(new ApiError("cart item not found"));
  //   }

  //   cart.cartItems = updatedCartItems;
  //   calcTotalCartPrice(cart);
  //   await cart.save();

  //   res.status(200).json({
  //     status: "success",
  //     message: "cart item removed successfully",
  //     data: cart,
  //   });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // get coupon
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("coupon is expired or invalid", 404));
  }
  // get user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;
  // calculate price after discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    result: cart.cartItems.length,
    status: "success",
    message: "Coupon applied",
    data: cart,
  });
});

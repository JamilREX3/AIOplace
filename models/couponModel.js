const mongoose = require("mongoose");

// print hello its me
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expired time required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);

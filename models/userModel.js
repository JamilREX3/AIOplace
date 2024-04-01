const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userScheme = new mongoose.Schema(
  {
    // done
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      slug: {
        type: String,
        lowercase: true,
      },
    },
    //donne
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "too short password"],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpired: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // parent reference ( 1 : m )
    wishlist: {
      type: [mongoose.Schema.ObjectId],
      ref: "Product",
      default: [],
    },
    addresses: {
      type: [
        {
          id: { type: mongoose.Schema.Types.ObjectId },
          alias: String,
          details: String,
          phone: String,
          city: String,
          postalCode: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_IMAGE_URL}/${doc.profileImg}`;
    doc.profileImg = imageUrl;
    console.log(`new doooooooooc:${doc}`);
  }
};

userScheme.post("findByIdAndUpdate", (doc) => {
  setImageUrl(doc);
});

userScheme.post("init", (doc) => {
  setImageUrl(doc);
});

// reviewScheme.post("deleteOne", { document: true }, async function () {
//   console.log("ssssssssssssssssssssssssss");
//   await this.constructor.calcAverageRatingsAndQuantity(this.product);
// });

userScheme.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 2);
  next();
});

const User = mongoose.model("User", userScheme);
module.exports = User;

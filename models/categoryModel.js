const mongoose = require("mongoose");
// 1-Create Scheme
const categoryScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category most be unique"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too short category name"],
    }, // Slug make A and B => a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image && !doc.image.startsWith(process.env.BASE_IMAGE_URL)) {
    const imageUrl = `${process.env.BASE_IMAGE_URL}/${doc.image}`;
    doc.image = imageUrl;
  }
};

categoryScheme.post("init", (doc) => {
  setImageUrl(doc);
});

// on create
categoryScheme.post("save", (doc) => {
  setImageUrl(doc);
});

// 2- Create model`
const CategoryModel = mongoose.model("Category", categoryScheme);

module.exports = CategoryModel;

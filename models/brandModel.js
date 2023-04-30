const mongoose = require("mongoose");
// 1-Create Scheme
const brandScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand required"],
            unique: [true, "Brand most be unique"],
            minLength: [3, "Too short Brand name"],
            maxLength: [32, "Too short Brand name"],
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
    if (doc.image) {
        const imageUrl = `${process.env.Base_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};

brandScheme.post("init", (doc) => {
    setImageUrl(doc);
});

// on create
brandScheme.post("save", (doc) => {
    setImageUrl(doc);
});


// 2- Create model`
const BrandModel = mongoose.model("Brand", brandScheme);

module.exports = BrandModel;

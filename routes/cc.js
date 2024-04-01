/* eslint-disable no-restricted-syntax */
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const CategoryModel = require("../models/categoryModel");
const SubCategoryModel = require("../models/subCategoryModel");
const BrandModel = require("../models/brandModel");

const carsProducts = [
  //done
  {
    title: "2022 Audi RS7",
    slug: "2022-audi-rs7",
    description:
      "The 2022 Audi RS7 is a luxury sportback sedan with a powerful V8 engine that can produce up to 591 horsepower. It offers a refined interior with premium materials and advanced technology features.",
    quantity: 10,
    sold: 5,
    price: 120000,
    priceAfterDiscount: null,
    colors: [
      "Daytona Gray Pearl",
      "Mythos Black Metallic",
      "Tango Red Metallic",
    ],
    imageCover: "2022-audi-rs7.jpg",
    images: [
      "2022-audi-rs7-1.jpg",
      "2022-audi-rs7-2.jpg",
      "2022-audi-rs7-3.jpg",
    ],
    category: "60990e1e7445174254fe4d4a",
    subcategories: [],
    brand: "60990ec87445174254fe4d4b",
    ratingsAverage: 4.5,
    ratingsQuantity: 10,
  },
  //done
  {
    title: "2022 BMW M8",
    slug: "2022-bmw-m8",
    description:
      "The 2022 BMW M8 is a high-performance luxury coupe with a twin-turbo V8 engine that can generate up to 617 horsepower. It features a premium interior with advanced technology features and a sporty exterior design.",
    quantity: 5,
    sold: 2,
    price: 140000,
    priceAfterDiscount: null,
    colors: [
      "Alpine White",
      "Black Sapphire Metallic",
      "Motorsport Frozen Bluestone Metallic",
    ],
    imageCover: "2022-bmw-m8.jpg",
    images: ["2022-bmw-m8-1.jpg", "2022-bmw-m8-2.jpg", "2022-bmw-m8-3.jpg"],
    category: "60990e1e7445174254fe4d4a",
    subcategories: [],
    brand: "60990ec87445174254fe4d4c",
    ratingsAverage: 4.8,
    ratingsQuantity: 8,
  },
  //done
  {
    title: "2023 Toyota RAV4 Hybrid",
    slug: "2023-toyota-rav4-hybrid",
    description:
      "The 2023 Toyota RAV4 Hybrid is a highly fuel-efficient compact SUV with plenty of standard safety features.",
    quantity: 10,
    sold: 0,
    price: 32990,
    priceAfterDiscount: null,
    colors: ["silver", "black", "white"],
    imageCover: "rav4.jpg",
    images: ["rav4-1.jpg", "rav4-2.jpg", "rav4-3.jpg"],
    category: "61e388b2bbf9e6223c29df7c",
    subcategories: [],
    brand: "61e38853bbf9e6223c29df76",
    ratingsAverage: 4.5,
    ratingsQuantity: 12,
  },
  //done
  {
    title: "2023 Honda Civic Sedan",
    slug: "2023-honda-civic-sedan",
    description:
      "The 2023 Honda Civic Sedan is a popular compact car known for its reliability and fuel efficiency.",
    quantity: 5,
    sold: 0,
    price: 21900,
    priceAfterDiscount: null,
    colors: ["blue", "black", "white", "red"],
    sizes: ["compact"],
    imageCover: "civic.jpg",
    images: ["civic-1.jpg", "civic-2.jpg", "civic-3.jpg"],
    category: "61e388d8bbf9e6223c29df84",
    subcategories: [],
    brand: "61e38853bbf9e6223c29df76",
    ratingsAverage: 4.2,
    ratingsQuantity: 9,
  },
  //done
  {
    title: "2023 Audi Q5 Sportback",
    slug: "2023-audi-q5-sportback",
    description:
      "The 2023 Audi Q5 Sportback is a luxury compact SUV with a sleek and sporty design.",
    quantity: 2,
    sold: 0,
    price: 47800,
    priceAfterDiscount: null,
    colors: ["blue", "black", "white", "red"],
    sizes: ["compact"],
    imageCover: "q5.jpg",
    images: ["q5-1.jpg", "q5-2.jpg", "q5-3.jpg"],
    category: "61e388b2bbf9e6223c29df7c",
    subcategories: [],
    brand: "61e3886ebbf9e6223c29df7a",
    ratingsAverage: 4.8,
    ratingsQuantity: 6,
  },
  // {
  //   title: "Audi Q7",
  //   slug: "audi-q7",
  //   description:
  //     "The Audi Q7 is a luxurious and spacious SUV with plenty of features and advanced technology.",
  //   quantity: 50,
  //   sold: 20,
  //   price: 65000,
  //   priceAfterDiscount: null,
  //   colors: ["black", "white", "gray", "silver"],
  //   sizes: [],
  //   imageCover: "audi-q7.jpg",
  //   images: ["audi-q7-1.jpg", "audi-q7-2.jpg", "audi-q7-3.jpg"],
  //   category: "6096d2b52c014b49744641f8",
  //   subcategories: ["6096d2d62c014b49744641fc"],
  //   brand: "6096d3852c014b497446422f",
  //   ratingsAverage: 4.5,
  //   ratingsQuantity: 25,
  // },
  //done
  {
    title: "BMW 3 Series",
    slug: "bmw-3-series",
    description:
      "The BMW 3 Series is a stylish and sporty sedan with excellent handling and a powerful engine.",
    quantity: 100,
    sold: 50,
    price: 45000,
    priceAfterDiscount: null,
    colors: ["black", "white", "gray", "blue"],
    sizes: [],
    imageCover: "bmw-3-series.jpg",
    images: ["bmw-3-series-1.jpg", "bmw-3-series-2.jpg", "bmw-3-series-3.jpg"],
    category: "6096d2b52c014b49744641f8",
    subcategories: ["6096d2d62c014b49744641fc"],
    brand: "6096d3852c014b4974464230",
    ratingsAverage: 4.8,
    ratingsQuantity: 30,
  },
  //done
  {
    title: "Chevrolet Camaro",
    slug: "chevrolet-camaro",
    description:
      "The Chevrolet Camaro is a classic American muscle car with a sleek and aggressive design.",
    quantity: 50,
    sold: 10,
    price: 40000,
    priceAfterDiscount: null,
    colors: ["red", "black", "white", "blue"],
    sizes: [],
    imageCover: "chevrolet-camaro.jpg",
    images: [
      "chevrolet-camaro-1.jpg",
      "chevrolet-camaro-2.jpg",
      "chevrolet-camaro-3.jpg",
    ],
    category: "6096d2b52c014b49744641f8",
    subcategories: ["6096d2e72c014b4974464200"],
    brand: "6096d3852c014b4974464231",
    ratingsAverage: 4.2,
    ratingsQuantity: 20,
  },
  //done
  {
    title: "2023 Lexus LS 500",
    slug: "2023-lexus-ls-500",
    description:
      "The 2023 Lexus LS 500 is a full-size luxury sedan with a sleek design and a powerful V6 engine. It comes with an extensive list of features and advanced safety technologies, making it one of the most comfortable and reliable vehicles on the market.",
    quantity: 15,
    sold: 0,
    price: 79500,
    colors: ["Silver", "Black", "Red"],
    sizes: ["Standard"],
    imageCover: "lexus-ls-500.jpg",
    images: ["lexus-ls-500-1.jpg", "lexus-ls-500-2.jpg", "lexus-ls-500-3.jpg"],
    category: "62fbc7edf05cbe28981e4c4f",
    subcategories: ["62fbc7edf05cbe28981e4c4f", "62fbc7edf05cbe28981e4c4d"],
    brand: "62fbc7edf05cbe28981e4c44",
    ratingsAverage: 4.7,
    ratingsQuantity: 12,
  },
  {
    title: "2023 Audi RS7 Sportback",
    slug: "2023-audi-rs7-sportback",
    description:
      "The 2023 Audi RS7 Sportback is a high-performance luxury sedan that offers an exceptional driving experience. It features a turbocharged V8 engine, all-wheel drive, and a sophisticated suspension system that delivers outstanding handling and control.",
    quantity: 10,
    sold: 0,
    price: 116500,
    colors: ["Black", "White", "Gray"],
    sizes: ["Standard"],
    imageCover: "audi-rs7-sportback.jpg",
    images: [
      "audi-rs7-sportback-1.jpg",
      "audi-rs7-sportback-2.jpg",
      "audi-rs7-sportback-3.jpg",
    ],
    category: "62fbc7edf05cbe28981e4c4f",
    subcategories: ["62fbc7edf05cbe28981e4c4f", "62fbc7edf05cbe28981e4c4e"],
    brand: "62fbc7edf05cbe28981e4c45",
    ratingsAverage: 4.8,
    ratingsQuantity: 9,
  },
  {
    title: "Honda Civic",
    slug: "honda-civic",
    description:
      "The Honda Civic is a compact car known for its reliability and fuel efficiency.",
    quantity: 10,
    sold: 0,
    price: 20000,
    priceAfterDiscount: 18000,
    colors: ["red", "black", "white"],
    sizes: ["S", "M", "L"],
    imageCover: "honda-civic.jpg",
    images: ["honda-civic-angle.jpg", "honda-civic-interior.jpg"],
    category: "62b0d1d8ee8a7f34c3459a89",
    subcategories: ["62b0d1d8ee8a7f34c3459a8a"],
    brand: "62b0d1d8ee8a7f34c3459a7e",
    ratingsAverage: 4.5,
    ratingsQuantity: 12,
  },
  //done
  {
    title: "Ford Mustang",
    slug: "ford-mustang",
    description:
      "The Ford Mustang is an iconic sports car known for its powerful engine and sleek design.",
    quantity: 15,
    sold: 5,
    price: 35000,
    priceAfterDiscount: 32000,
    colors: ["blue", "white", "red"],
    sizes: ["S", "M", "L"],
    imageCover: "ford-mustang.jpg",
    images: ["ford-mustang-angle.jpg", "ford-mustang-interior.jpg"],
    category: "62b0d1d8ee8a7f34c3459a89",
    subcategories: ["62b0d1d8ee8a7f34c3459a8a"],
    brand: "62b0d1d8ee8a7f34c3459a7f",
    ratingsAverage: 4.8,
    ratingsQuantity: 22,
  },

  {
    title: "Audi A8",
    slug: "audi-a8",
    description:
      "The Audi A8 is a luxury sedan known for its advanced technology and elegant interior.",
    quantity: 5,
    sold: 0,
    price: 80000,
    priceAfterDiscount: 75000,
    colors: ["black", "white", "silver"],
    sizes: ["S", "M", "L"],
    imageCover: "audi-a8.jpg",
    images: ["audi-a8-angle.jpg", "audi-a8-interior.jpg"],
    category: "62b0d1d8ee8a7f34c3459a89",
    subcategories: ["62b0d1d8ee8a7f34c3459a8b"],
    brand: "62b0d1d8ee8a7f34c3459a83",
    ratingsAverage: 4.6,
    ratingsQuantity: 9,
  },

  {
    title: "2023 Honda Civic",
    slug: "2023-honda-civic",
    description:
      "The 2023 Honda Civic is a sleek and stylish sedan with a comfortable interior and smooth ride. It features a 2.0L 4-cylinder engine with 158 horsepower and a continuously variable transmission.",
    quantity: 10,
    sold: 0,
    price: 22000,
    colors: ["blue", "white", "black"],
    sizes: ["small", "medium", "large"],
    imageCover: "civic.png",
    images: ["civic-back.png", "civic-interior.png"],
    category: "6158dc8f64e83c3996a1421c",
    subcategories: ["6158dc8f64e83c3996a1421d"],
    brand: "6158dc8f64e83c3996a1421b",
    ratingsAverage: 4.5,
    ratingsQuantity: 10,
    priceAfterDiscount: 0,
  },

  //done
  {
    title: "2023 Toyota RAV4",
    slug: "2023-toyota-rav4",
    description:
      "The 2023 Toyota RAV4 is a rugged and reliable SUV with excellent off-road capabilities. It features a 2.5L 4-cylinder engine with 203 horsepower and an 8-speed automatic transmission.",
    quantity: 5,
    sold: 0,
    price: 31000,
    colors: ["red", "black", "white"],
    sizes: ["small", "medium", "large"],
    imageCover: "rav4.png",
    images: ["rav4-back.png", "rav4-interior.png"],
    category: "6158dc8f64e83c3996a1421c",
    subcategories: ["6158dc8f64e83c3996a1421d"],
    brand: "6158dc8f64e83c3996a1421a",
    ratingsAverage: 4.2,
    ratingsQuantity: 5,
    priceAfterDiscount: 0,
  },
  //done
  {
    title: "2023 Porsche 911",
    slug: "2023-porsche-911",
    description:
      "The 2023 Porsche 911 is a high-performance sports car with a sleek and aerodynamic design. It features a 3.0L twin-turbocharged 6-cylinder engine with 443 horsepower and a 7-speed dual-clutch automatic transmission.",
    quantity: 2,
    sold: 0,
    price: 180000,
    colors: ["red", "black", "white"],
    sizes: ["small", "medium", "large"],
    imageCover: "911.png",
    images: ["911-back.png", "911-interior.png"],
    category: "6158dc8f64e83c3996a1421c",
    subcategories: ["6158dc8f64e83c3996a1421e"],
    brand: "6158dc8f64e83c3996a1421f",
    ratingsAverage: 4.8,
    ratingsQuantity: 2,
    priceAfterDiscount: 0,
  },
  //done
  {
    title: "2023 BMW X7 M50i",
    slug: "2023-bmw-x7-m50i",
    description:
      "The 2023 BMW X7 M50i is a full-size luxury SUV that offers a powerful 4.4-liter V8 engine with 523 horsepower and 553 lb-ft of torque. It comes with a number of advanced safety features and premium amenities, including a panoramic sunroof, heated front seats, and wireless charging. The X7 M50i also offers a top speed of 155 mph and can accelerate from 0 to 60 mph in just 4.5 seconds.",
    quantity: 10,
    sold: 0,
    price: 89900,
    priceAfterDiscount: 84900,
    colors: [
      "Alpine White",
      "Black Sapphire Metallic",
      "Phytonic Blue Metallic",
    ],
    sizes: ["Standard"],
    imageCover: "https://example.com/images/2023-bmw-x7-m50i.jpg",
    images: [
      "https://example.com/images/2023-bmw-x7-m50i-1.jpg",
      "https://example.com/images/2023-bmw-x7-m50i-2.jpg",
      "https://example.com/images/2023-bmw-x7-m50i-3.jpg",
    ],
    category: "62d2be80-951c-11ec-8a9f-9d00a8140421",
    subcategories: [
      "72d2be80-951c-11ec-8a9f-9d00a8140421",
      "82d2be80-951c-11ec-8a9f-9d00a8140421",
    ],
    brand: "92d2be80-951c-11ec-8a9f-9d00a8140421",
    ratingsAverage: 4.7,
    ratingsQuantity: 6,
    createdAt: "2023-05-09T14:15:20.588Z",
    updatedAt: "2023-05-09T14:15:20.588Z",
    reviews: [],
  },
];

const categories = [
  {
    name: "Shoes",
    subcategories: [
      "Sandals",
      "Women's Boots",
      "Sports Shoes",
      "Men's Dress Shoes",
      "Sneakers",
    ],
  },
  {
    name: "Cars",
    subcategories: ["SUVs", "Sedans", "Trucks", "Vans", "Sports Cars"],
  },
  {
    name: "Clothing",
    subcategories: [
      "Women's Dresses",
      "Men's Shirts",
      "Children's Clothing",
      "Activewear",
      "Outerwear",
    ],
  },
  {
    name: "Electronics",
    subcategories: [
      "Mobile Phones",
      "Laptops",
      "Tablets",
      "Televisions",
      "Cameras",
    ],
  },
  {
    name: "Home and Garden",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Kitchen and Dining",
      "Bedding and Bath",
      "Outdoor Living",
    ],
  },
  {
    name: "Beauty and Personal Care",
    subcategories: [
      "Makeup",
      "Skincare",
      "Haircare",
      "Fragrances",
      "Men's Grooming",
    ],
  },
  {
    name: "Sports and Outdoors",
    subcategories: [
      "Camping and Hiking",
      "Cycling",
      "Fishing",
      "Golfing",
      "Hunting",
    ],
  },
  {
    name: "Toys and Games",
    subcategories: [
      "Action Figures and Statues",
      "Arts and Crafts",
      "Building Toys",
      "Dolls and Accessories",
      "Games and Puzzles",
    ],
  },
  {
    name: "Books",
    subcategories: [
      "Fiction",
      "Non-fiction",
      "Children's Books",
      "Cookbooks",
      "Travel Guides",
    ],
  },
  {
    name: "Music",
    subcategories: [
      "CDs and Vinyls",
      "Digital Music Downloads",
      "Musical Instruments",
    ],
  },
  {
    name: "Jewelry and Watches",
    subcategories: [
      "Rings",
      "Necklaces and Pendants",
      "Earrings",
      "Bracelets and Bangles",
    ],
  },
  {
    name: "Handbags and Accessories",
    subcategories: ["Totes and Shoppers", "Crossbody Bags"],
  },
  {
    name: "Health and Wellness",
    subcategories: ["Vitamins and Supplements"],
  },
  {
    name: "Pet Supplies",
    subcategories: ["Dog Food and Treats"],
  },
  {
    name: "Office Supplies",
    subcategories: ["Paper Products"],
  },
  {
    name: "Art Supplies",
    subcategories: ["Paints and Mediums"],
  },
  {
    name: "Craft Supplies",
    subcategories: ["Beads and Jewelry Making"],
  },
  {
    name: "Party Supplies",
    subcategories: ["Balloons and Decorations"],
  },
  {
    name: "School Supplies",
    subcategories: ["Backpacks and Lunchboxes"],
  },
  {
    name: "Kitchen Appliances",
    subcategories: ["Blenders and Juicers"],
  },
  {
    name: "Home Appliances",
    subcategories: ["Vacuum Cleaners and Floor Care"],
  },
  {
    name: "Gardening Supplies",
    subcategories: ["Seeds and Bulbs"],
  },
  {
    name: "Automotive Supplies",
    subcategories: ["Car Care Products"],
  },
  {
    name: "Cleaning Supplies",
    subcategories: ["All-Purpose Cleaners"],
  },
  {
    name: "Laundry Supplies",
    subcategories: ["Detergents and Fabric Softeners"],
  },
  {
    name: "Bathroom Supplies",
    subcategories: ["Towels and Washcloths"],
  },
  {
    name: "Bedroom Supplies",
    subcategories: ["Sheets and Pillowcases"],
  },
  {
    name: "Dining Room Supplies",
    subcategories: ["Tablecloths and Placemats"],
  },
  {
    name: "Living Room Supplies",
    subcategories: ["Throw Pillows and Blankets"],
  },
  {
    name: "Outdoor Living Supplies",
    subcategories: ["Patio Furniture"],
  },
  {
    name: "Laptop Accessories",
    subcategories: [
      "Laptop Cases and Bags",
      "Laptop Cooling Pads",
      "Laptop Batteries",
      "Laptop Chargers and Adapters",
      "Laptop Screen Protectors",
    ],
  },
  {
    name: "Mobile Accessories",
    subcategories: [
      "Phone Cases and Covers",
      "Screen Protectors",
      "Phone Chargers and Cables",
      "Phone Batteries",
      "Phone Headsets and Earphones",
    ],
  },
  {
    name: "Laptops",
    subcategories: ["Gaming Laptops", "Office laptops"],
  },
  {
    name: "Mobiles",
    subcategories: ["Gaming Mobiles", "Office Mobiles"],
  },
];

const brands = {
  Shoes: [
    "Nike",
    "Adidas",
    "Reebok",
    "Skechers",
    "Clarks",
    "Puma",
    "Crocs",
    "Converse",
    "Vans",
    "UGG",
  ],
  Cars: [
    "Toyota",
    "Honda",
    "Ford",
    "BMW",
    "Tesla",
    "Hyundai",
    "Nissan",
    "Chevrolet",
    "Mercedes-Benz",
    "Volvo",
  ],
  Clothing: [
    "Zara",
    "H&M",
    "Gap",
    "Levi’s",
    "Calvin Klein",
    "Ralph Lauren",
    "Tommy Hilfiger",
    "Forever 21",
    "Uniqlo",
    "Old Navy",
  ],
  Electronics: [
    "Samsung",
    "Apple",
    "Sony",
    "LG",
    "Dell",
    "HP",
    "Lenovo",
    "Panasonic",
    "Canon",
    "Bose",
  ],
  "Home and Garden": [
    "Ikea",
    "Home Depot",
    "Bed Bath & Beyond",
    "Pottery Barn",
    "Wayfair",
    "Lowe’s",
    "Target",
    "Crate and Barrel",
    "Pier 1 Imports",
    "Williams-Sonoma",
  ],
  "Beauty and Personal Care": [
    "L’Oreal",
    "Maybelline",
    "Clinique",
    "Estee Lauder",
    "Nivea",
    "Olay",
    "Dove",
    "Neutrogena",
    "Avon",
    "Revlon",
  ],
  "Sports and Outdoors": [
    "Columbia",
    "The North Face",
    "Patagonia",
    "REI",
    "Under Armour",
    "Nike",
    "Adidas",
    "Reebok",
    "Skechers",
    "Clarks",
  ],
  "Toys and Games": [
    "Lego",
    "Hasbro",
    "Mattel",
    "Fisher-Price",
    "Disney",
    "Nerf",
    "Hot Wheels",
    "Barbie",
    "Playmobil",
    "Funko",
  ],
  Books: [
    "Penguin Random House",
    "HarperCollins",
    "Simon & Schuster",
    "Hachette",
    "Macmillan",
    "Scholastic",
    "Bloomsbury",
    "Wiley",
    "Oxford University Press",
  ],
  Music: [
    "Universal Music Group",
    "Sony Music Entertainment",
    "Warner Music Group",
    "EMI Music Publishing",
    "Spotify",
  ],
  "Jewelry and Watches": [
    "Tiffany & Co.",
    "Cartier",
    "Rolex",
    "Swarovski",
    "Pandora",
    "Fossil",
  ],
  "Handbags and Accessories": [
    "Coach",
    "Michael Kors",
    "Kate Spade New York",
    "Gucci",
  ],
  "Health and Wellness": ["GNC", "Nature’s Bounty", "Nature Made"],
  "Pet Supplies": ["Purina", "Pedigree"],
  "Office Supplies": ["Staples", "Office Depot"],
  "Art Supplies": ["Blick Art Materials", "Crayola"],
  "Craft Supplies": ["Michaels", "Joann"],
  "Party Supplies": ["Party City", "Oriental Trading"],
  "School Supplies": ["Jansport", "Crayola"],
  "Kitchen Appliances": ["KitchenAid", "Cuisinart"],
  "Home Appliances": ["Dyson", "Whirlpool"],
  "Gardening Supplies": ["Burpee", "Miracle-Gro"],
  "Automotive Supplies": ["Turtle Wax", "Armor All"],
  "Cleaning Supplies": ["Lysol", "Clorox"],
  "Laundry Supplies": ["Tide", "Bounce"],
  "Bathroom Supplies": ["Charmin", "Bounty"],
  "Bedroom Supplies": ["Brooklinen", "Casper"],
  "Dining Room Supplies": ["Lenox", "Corelle"],
  "Living Room Supplies": ["West Elm", "Pottery Barn"],
  "Outdoor Living Supplies": ["Hampton Bay", "Weber"],
  "Laptop Accessories": ["Logitech", "Belkin", "Adata", "Asus"],
  "Mobile Accessories": ["Anker", "Otterbox", "Syrox"],
  Mobiles: [
    "Apple",
    "samsung",
    "Huawei",
    "Xiaomi",
    "Google",
    "Realme",
    "Oppo",
    "Honor",
  ],
  Laptops: ["Apple", "Hp", "Dell", "Lenovo", "Asus", "toshiba", "Accer"],
};

const createCategoriesAndSubcategories = asyncHandler(
  async (req, res, next) => {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const categoryData of categories) {
        // Check if category already exists
        // eslint-disable-next-line no-await-in-loop
        const existingCategory = await CategoryModel.findOne({
          name: categoryData.name,
        });
        let category;
        if (existingCategory) {
          // Use existing category
          category = existingCategory;
          console.log(`Category already exists: ${category.name}`);
        } else {
          // Create new category
          // eslint-disable-next-line no-await-in-loop
          category = await CategoryModel.create({
            name: categoryData.name,
            slug: slugify(categoryData.name),
          });
          console.log(`Category created: ${category.name}`);
        }

        // Create subcategories
        // eslint-disable-next-line no-restricted-syntax
        for (const subcategoryName of categoryData.subcategories) {
          // eslint-disable-next-line no-await-in-loop
          const subcategory = await SubCategoryModel.create({
            name: subcategoryName,
            slug: slugify(subcategoryName),
            category: category._id,
          });
          console.log(`Subcategory created: ${subcategory.name}`);
        }
      }

      // Create or update brands
      for (const [categoryName, brandNames] of Object.entries(brands)) {
        const category = await CategoryModel.findOne({ name: categoryName });
        if (!category) {
          console.log(`Category not found for brand: ${categoryName}`);
          continue;
        }
        for (const brandName of brandNames) {
          let brand = await BrandModel.findOne({ name: brandName });
          if (brand) {
            console.log(`Brand already exists: ${brandName}`);
            if (!brand.categories.includes(category._id)) {
              brand.categories.push(category._id);
              await brand.save();
              console.log(`Brand updated with new category: ${brandName}`);
            }
            continue;
          }
          brand = await BrandModel.create({
            name: brandName,
            slug: slugify(brandName),
            categories: [category._id],
          });
          console.log(`Brand created: ${brand.name}`);
        }
      }

      console.log("mission accomplished");
      res.status(201).json({ status: "success" });
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = createCategoriesAndSubcategories;

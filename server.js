/* eslint-disable import/order */
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const mountRoutes = require("./routes");
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require("compression");
const cloudinary = require("cloudinary").v2;

dotenv.config({ path: "config.env" });

// connect with db
dbConnection();

//express App
const app = express();
// enable other domains to access my application
app.use(cors());
app.options("*", cors());
//compress all response
app.use(compression());

// Middleware

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mount Routes
mountRoutes(app);

app.use("*", (req, res, next) => {
  // go to app.use(globalError);
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
});

//Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("Hello world");
  console.log(process.env.DB_NAME);
  console.log(`App running on port ${PORT}`);
});

// handling rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down...");
    process.exit(1);
  });
});

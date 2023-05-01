// const express = require("express");

// const app = express();
// const dotenv = require("dotenv");

// const multer = require("multer");

// const multerS3 = require("multer-s3");

// dotenv.config({ path: "config.env" });

// const AWS = require("@aws-sdk/client-s3");
// //const AWS = require("aws-sdk");

// // AWS.config.({
// //   accessKeyId: "ASIA57IFXX7YQPVZD235",
// //   secretAccessKey: "jU+Sx5fGcLgYjKsgl//Ttg+vsIK1ZtotedVkfAxI",
// // });
// const s3 = new AWS.S3({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     sessionToken: process.env.AWS_SESSION_TOKEN,
//   },
// });
// const myBucket = "cyclic-jittery-red-hippo-eu-west-1";

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: myBucket,
//     acl: "public-read",
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   }),
// });

// app.post("/upload", upload.single("myPic"), (req, res) => {
//   console.log(req.file);
//   res.send("Successfully uploaded");
// });

// const server = app.listen(7000, () => {
//   console.log("Hello world");
//   console.log(process.env.DB_NAME);
//   console.log(`App running on port 7000}`);
// });

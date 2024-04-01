
const mongoose= require ('mongoose');

const database = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((con) => {

      console.log("MY Database connection : " + con.connection.host);
    })
    // .catch((err) => {
    //   console.error("Database error : " + err);
    //   process.exit(1);
    // });
};

module.exports = database;

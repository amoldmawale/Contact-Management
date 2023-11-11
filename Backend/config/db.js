const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose
    .connect("mongodb://localhost:27017/ContactKeeper")
    .then(() => console.log(`Connected to database...`))
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB();

const mongoose = require("mongoose");
require("dotenv").config();

console.log(process.env.DB_URI);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

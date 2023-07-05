const mongoose = require("mongoose");
const config = require("../../server-config.json");

mongoose
  .connect(config["mongodb-connection-uri"])
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

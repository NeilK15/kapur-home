const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    num: Number,
  },
  { collection: "counter" }
);

module.exports = mongoose.model("Counter", counterSchema);

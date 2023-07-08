const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  tag: recipeTagSchema,
});

const recipeTagSchema = new mongoose.Schema({
  name: String,
});

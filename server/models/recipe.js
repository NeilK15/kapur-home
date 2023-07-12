const mongoose = require("mongoose");
require("dotenv").config();

const recipeSchema = new mongoose.Schema(
  {
    name: String, // Breakfast Potatoes
    prepTime: Number,
    prepTiemUnit: String,
    cookTime: Number,
    cookTiemUnit: String,
    totalTime: Number,
    totalTiemUnit: String,
    courses: [String], //
    cuisine: [String],
    keywords: [String],
    servings: Number,
    author: String,
    url: URL,
    imageUrl: URL,
    description: String,
    tags: [recipeTagSchema], // Appetizers, Breakfast
    ingredientGroups: [
      {
        title: String, // For the potatoes
        ingredients: [
          {
            name: String, // Yukon Potatoes
            amount: {
              amt: Number, // 1.5
              unit: String, // pounds
              scale: String, // imperial or metric
            },
            notes: String,
          },
        ],
      },
    ],
    instructionGroups: [
      {
        title: String, // For the potatoes
        instructions: [
          {
            instruction: String, // Peel the potatoes
            imageUrl: URL, // Image of peeling potatoes
          },
        ],
      },
    ],
    tips: [
      {
        title: String, // To reheat
        tip: String, // Place in microwave
      },
    ],
    nutrition: [
      {
        title: String, // Calories, Fat, etc
        value: Number, // 300, 350, 400, etc
        unit: String, // cals, g, mg, iu, etc
      },
    ],
    metadata: {
      dateAdded: Date,
    },
  },
  { collection: DB_RECIPE_COLLECTION }
);

const recipeTagSchema = mongoose.Schema(
  {
    name: String,
    color: String,
  },
  { collection: DB_TAG_COLLECTION }
);

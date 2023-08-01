const mongoose = require("mongoose");
require("dotenv").config();

exports.recipeSchema = new mongoose.Schema(
    {
        name: { type: String, default: null }, // Breakfast Potatoes
        prepTime: { type: Number, default: null },
        prepTiemUnit: { type: String, default: null },
        cookTime: { type: Number, default: null },
        cookTiemUnit: { type: String, default: null },
        totalTime: { type: Number, default: null },
        totalTiemUnit: { type: String, default: null },
        courses: [{ type: String, default: null }], //
        cuisine: { type: String, default: null },
        keywords: [{ type: String, default: null }],
        servings: { type: Number, default: null },
        author: { type: String, default: null },
        url: { type: String, default: null },
        imageUrl: { type: String, default: null },
        description: { type: String, default: null },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag",
            },
        ], // Appetizers, Breakfast
        ingredientGroups: [
            {
                title: { type: String, default: null }, // For the potatoes
                ingredients: [
                    {
                        name: { type: String, default: null }, // Yukon Potatoes
                        amount: {
                            amt: { type: String, default: null }, // 1.5
                            unit: { type: String, default: null }, // pounds
                            scale: { type: String, default: null }, // imperial or metric
                        },
                        notes: { type: String, default: null },
                    },
                ],
            },
        ],
        instructionGroups: [
            {
                title: { type: String, default: null }, // For the potatoes
                instructions: [
                    {
                        instruction: { type: String, default: null }, // Peel the potatoes
                        imageUrl: { type: String, default: null }, // Image of peeling potatoes
                    },
                ],
            },
        ],
        tips: [
            {
                title: { type: String, default: null }, // To reheat
                note: { type: String, default: null }, // Place in microwave
            },
        ],
        nutrition: [
            {
                title: { type: String, default: null }, // Calories, Fat, etc
                value: { type: Number, default: null }, // 300, 350, 400, etc
                unit: { type: String, default: null }, // cals, g, mg, iu, etc
            },
        ],
        metadata: {
            dateAdded: { type: Date, default: Date.now },
        },
    },
    { collection: process.env.DB_RECIPE_COLLECTION }
);

const recipeTagSchema = mongoose.Schema(
    {
        name: String,
        color: String,
    },
    { collection: process.env.DB_TAG_COLLECTION }
);

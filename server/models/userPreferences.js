const mongoose = require("mongoose");

const userPreferencesSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        theme: { type: String, enum: ["dark", "light"], default: "dark" },
    },
    { collection: "userPreferences", timestamps: true }
);

module.exports = mongoose.model("UserPreferences", userPreferencesSchema);

const mongoose = require("mongoose");

const cookbookSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        coverImageUrl: { type: String, default: "" },
        createdBy: { type: String, default: null },
    },
    {
        collection: "cookbooks",
        timestamps: true,
    }
);

module.exports = { cookbookSchema };

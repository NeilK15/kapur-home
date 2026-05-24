const { default: mongoose } = require("mongoose");
const { cookbookSchema } = require("../models/cookbook");
const { recipeSchema } = require("../models/recipe");

function CookbookModel() {
    return mongoose.model("Cookbook", cookbookSchema);
}

function RecipeModel() {
    return mongoose.model("Recipe", recipeSchema);
}

exports.getCookbooks = async (req, res) => {
    try {
        const cookbooks = await CookbookModel().find().sort({ createdAt: -1 });

        const cookbooksWithCount = await Promise.all(
            cookbooks.map(async (cookbook) => {
                const recipeCount = await RecipeModel().countDocuments({ cookbookId: cookbook._id });
                return { ...cookbook.toJSON(), recipeCount };
            })
        );

        res.status(200).json(cookbooksWithCount);
    } catch (err) {
        console.error("Error in GET /cookbooks", err.message);
        res.status(500).json({ error: "Failed to fetch cookbooks" });
    }
};

exports.getCookbook = async (req, res) => {
    const { id } = req.params;
    try {
        const cookbook = await CookbookModel().findById(id);
        if (!cookbook) return res.status(404).json({ error: "Cookbook not found" });

        const recipes = await RecipeModel().find({ cookbookId: id });

        res.status(200).json({
            ...cookbook.toJSON(),
            recipes: recipes.map((r) => r.toJSON()),
        });
    } catch (err) {
        console.error("Error in GET /cookbooks/:id", err.message);
        res.status(500).json({ error: "Failed to fetch cookbook" });
    }
};

exports.postCookbook = async (req, res) => {
    const { name, description, coverImageUrl } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    try {
        const cookbook = new (CookbookModel())({
            name,
            description,
            coverImageUrl,
            createdBy: req.userId,
        });
        await cookbook.save();
        res.status(200).json(cookbook.toJSON());
    } catch (err) {
        console.error("Error in POST /cookbooks", err.message);
        res.status(500).json({ error: "Failed to create cookbook" });
    }
};

exports.putCookbook = async (req, res) => {
    const { id } = req.params;
    const { name, description, coverImageUrl } = req.body;

    try {
        const cookbook = await CookbookModel().findByIdAndUpdate(
            id,
            { name, description, coverImageUrl },
            { new: true }
        );
        if (!cookbook) return res.status(404).json({ error: "Cookbook not found" });
        res.status(200).json(cookbook.toJSON());
    } catch (err) {
        console.error("Error in PUT /cookbooks/:id", err.message);
        res.status(500).json({ error: "Failed to update cookbook" });
    }
};

exports.deleteCookbook = async (req, res) => {
    const { id } = req.params;
    try {
        await CookbookModel().findByIdAndDelete(id);
        res.status(200).json({ deleted: id });
    } catch (err) {
        console.error("Error in DELETE /cookbooks/:id", err.message);
        res.status(500).json({ error: "Failed to delete cookbook" });
    }
};

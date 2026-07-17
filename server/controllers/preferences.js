const UserPreferences = require("../models/userPreferences");

exports.getPreferences = async (req, res) => {
    try {
        const prefs = await UserPreferences.findOne({ userId: req.userId });
        res.json({ theme: prefs?.theme ?? "dark" });
    } catch (err) {
        console.error("Failed to get preferences:", err);
        res.status(500).json({ error: "Failed to get preferences" });
    }
};

exports.updatePreferences = async (req, res) => {
    const { theme } = req.body;
    if (!["dark", "light"].includes(theme)) {
        return res.status(400).json({ error: "Invalid theme value" });
    }
    try {
        const prefs = await UserPreferences.findOneAndUpdate(
            { userId: req.userId },
            { theme },
            { upsert: true, new: true, runValidators: true }
        );
        res.json({ theme: prefs.theme });
    } catch (err) {
        console.error("Failed to update preferences:", err);
        res.status(500).json({ error: "Failed to update preferences" });
    }
};

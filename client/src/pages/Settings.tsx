import { useState } from "react";
import { updatePreferences, applyTheme } from "../../lib/preferences";
import { useTheme } from "../context/ThemeContext";
import type { Theme } from "../context/ThemeContext";
import { version } from "../../package.json";
import "../css/settings.css";

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const [saving, setSaving] = useState(false);

    async function handleThemeChange(newTheme: Theme) {
        if (newTheme === theme || saving) return;
        setSaving(true);
        try {
            await updatePreferences({ theme: newTheme });
            setTheme(newTheme);
            applyTheme(newTheme);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="settings_page">
            <h1 className="settings__title">Settings</h1>

            <section className="settings__section">
                <h2 className="settings__section__title">Appearance</h2>
                <div className="settings__option">
                    <div className="settings__option__info">
                        <span className="settings__option__label">Theme</span>
                        <span className="settings__option__description">
                            Synced across all your devices
                        </span>
                    </div>
                    <div className="settings__theme_buttons">
                        <button
                            className={`settings__theme_btn${theme === "dark" ? " settings__theme_btn--active" : ""}`}
                            onClick={() => handleThemeChange("dark")}
                            disabled={saving}
                        >
                            Dark
                        </button>
                        <button
                            className={`settings__theme_btn${theme === "light" ? " settings__theme_btn--active" : ""}`}
                            onClick={() => handleThemeChange("light")}
                            disabled={saving}
                        >
                            Light
                        </button>
                    </div>
                </div>
            </section>

            <p className="settings__version">Kapur Home v{version}</p>
        </div>
    );
};

export default Settings;

import { authHeaders } from "./api";

export interface UserPreferences {
    theme: "dark" | "light";
}

export async function getPreferences(): Promise<UserPreferences> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/preferences`, {
        headers: await authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load preferences");
    return res.json();
}

export async function updatePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify(prefs),
    });
    if (!res.ok) throw new Error("Failed to save preferences");
    return res.json();
}

export function applyTheme(theme: "dark" | "light"): void {
    if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

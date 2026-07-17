import { createContext, useContext } from "react";

export type Theme = "dark" | "light";

type ThemeContextType = {
    theme: Theme;
    setTheme: (t: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    setTheme: () => {},
});

export function useTheme() {
    return useContext(ThemeContext);
}

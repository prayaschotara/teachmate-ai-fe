import React, { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";
import { useAppStore } from "../store/useAppStore";

type Theme = "light" | "dark";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { setTheme: setThemeAppStore } = useAppStore();
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    const theme = saved === "light" || saved === "dark" ? saved : "dark";
    return theme as Theme;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    setThemeAppStore(theme);
  }, [theme, setThemeAppStore]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

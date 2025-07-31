import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("theme-mode");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });

  const toggleTheme = () => {
    // Temporarily add a class to trigger CSS transitions
    document.body.classList.add("theme-transition");

    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));

    // Remove the transition class after the animation completes
    setTimeout(() => {
      document.body.classList.remove("theme-transition");
    }, 300);
  };

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme-mode", themeMode);

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", themeMode);
    document.body.className = themeMode;
  }, [themeMode]);

  const value: ThemeContextType = {
    themeMode,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

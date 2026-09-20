import { createContext, useContext, useEffect, useState } from "react";

// ============================================================
// Two frontend-only preferences, persisted in localStorage so
// they survive a page refresh:
//  - theme: "light" | "dark" | "system"
//  - textSize: "small" | "medium" | "large"
//
// Both are applied as data-attributes on <html> (data-theme,
// data-text-size), which index.css reads via attribute selectors
// like [data-theme="light"] and [data-text-size="large"]. Putting
// them on <html> rather than deep inside the component tree means
// they apply everywhere at once (auth pages included), with no
// prop-drilling needed.
// ============================================================

const SettingsContext = createContext(null);

const THEME_KEY = "settings:theme";
const TEXT_SIZE_KEY = "settings:textSize";

function getSystemPrefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

function resolveTheme(theme) {
  // "system" isn't a real CSS value — resolve it to light/dark
  // right before applying, based on the OS-level preference.
  if (theme === "system") {
    return getSystemPrefersDark() ? "dark" : "light";
  }
  return theme;
}

export function SettingsProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(THEME_KEY) || "dark"
  );
  const [textSize, setTextSizeState] = useState(
    () => localStorage.getItem(TEXT_SIZE_KEY) || "medium"
  );

  // Apply theme to <html> whenever it changes, AND re-apply if the
  // OS-level scheme changes while "system" is selected (e.g. user
  // switches their OS from light to dark mode mid-session).
  useEffect(() => {
    function apply() {
      document.documentElement.setAttribute("data-theme", resolveTheme(theme));
    }
    apply();
    localStorage.setItem(THEME_KEY, theme);

    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-text-size", textSize);
    localStorage.setItem(TEXT_SIZE_KEY, textSize);
  }, [textSize]);

  return (
    <SettingsContext.Provider
      value={{ theme, setTheme: setThemeState, textSize, setTextSize: setTextSizeState }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}

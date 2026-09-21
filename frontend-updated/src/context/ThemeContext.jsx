import { createContext, useContext, useEffect, useState } from "react";



const THEME_KEY = "themePreference";
const ThemeContext = createContext(null);

function getSystemPrefersLight() {
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

function resolveTheme(preference) {
  if (preference === "system") {
    return getSystemPrefersLight() ? "light" : "dark";
  }
  return preference;
}

export function ThemeProvider({ children }) {

  const [preference, setPreference] = useState(
    () => localStorage.getItem(THEME_KEY) || "system"
  );

  useEffect(() => {
    const applied = resolveTheme(preference);
    if (applied === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem(THEME_KEY, preference);
  }, [preference]);


  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    function handleChange() {
      document.documentElement.setAttribute(
        "data-theme",
        mq.matches ? "light" : ""
      );
    }
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [preference]);

  return (
    <ThemeContext.Provider value={{ preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

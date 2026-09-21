import { createContext, useContext, useEffect, useState } from "react";

const SIZE_KEY = "chatTextSize";
const SIZES = { small: "0.8rem", medium: "0.9rem", large: "1.05rem" };

const TextSizeContext = createContext(null);

export function TextSizeProvider({ children }) {
  const [size, setSize] = useState(
    () => localStorage.getItem(SIZE_KEY) || "medium"
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--chat-font-size",
      SIZES[size] || SIZES.medium
    );
    localStorage.setItem(SIZE_KEY, size);
  }, [size]);

  return (
    <TextSizeContext.Provider value={{ size, setSize }}>
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize() {
  const ctx = useContext(TextSizeContext);
  if (!ctx) throw new Error("useTextSize must be used inside TextSizeProvider");
  return ctx;
}

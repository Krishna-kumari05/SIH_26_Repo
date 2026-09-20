import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientId = envClientId || "not-configured.apps.googleusercontent.com";

if (!envClientId) {
  console.warn(
    "VITE_GOOGLE_CLIENT_ID is not set in .env — Google sign-in will not work until you add it and restart the dev server."
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);

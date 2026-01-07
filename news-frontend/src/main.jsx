import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
// --- IMPORT YOUR AUTH PROVIDER HERE ---
import AuthProvider from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="206200502424-vflhba2rhcf41vvrt6t2spekj5mjj19m.apps.googleusercontent.com">
      {/* --- WRAP APP WITH YOUR AUTH PROVIDER --- */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

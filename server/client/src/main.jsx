import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Landing from "./pages/Landing.jsx";

createRoot(document.getElementById("root")).render(
  <div className="main-app">
    <BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Routes>
        {/* <Route path="/" element={<App />} /> */}
        <Route index path="/dashboard" element={<App />} />
        <Route index path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  </div>
);

import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import DevicePage from "./pages/DevicePage";

// Utility component to manage focus on route change for accessibility
function RouteChangeFocus() {
  const location = useLocation();
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
    }
  }, [location]);
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /** Root application component: sets theme and routes. */
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle light/dark theme. */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar" role="navigation" aria-label="Main navigation">
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Link to="/" className="title" aria-label="Go to dashboard">Device Inventory</Link>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Link to="/devices/new" className="btn btn-small" aria-label="Add new device">+ Add</Link>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </div>
        </nav>

        <RouteChangeFocus />

        <div className="container" style={{ paddingTop: 24 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices/new" element={<DevicePage />} />
            <Route path="/devices/:id" element={<DevicePage />} />
            <Route path="/devices/:id/edit" element={<DevicePage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

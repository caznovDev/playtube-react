import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Models from "./pages/Models";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="app-main-inner">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/models" element={<Models />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

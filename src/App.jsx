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
    <div className="flex min-h-screen bg-darkbg text-gray-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col md:ml-56">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 px-3 pb-6 pt-3 md:px-6">
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

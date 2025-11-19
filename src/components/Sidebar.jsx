import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">Navegar</div>

      <Link
        to="/"
        className="sidebar-link"
        style={isActive("/") ? { background: "#27272a" } : undefined}
      >
        🏠 <span>Início</span>
      </Link>

      <Link
        to="/models"
        className="sidebar-link"
        style={isActive("/models") ? { background: "#27272a" } : undefined}
      >
        👩‍💻 <span>Modelos</span>
      </Link>

      <div className="sidebar-section-title">Outros</div>

      <a
        href="https://github.com/caznovDev"
        target="_blank"
        rel="noreferrer"
        className="sidebar-link"
      >
        💻 <span>GitHub</span>
      </a>
    </aside>
  );
}

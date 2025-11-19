import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar-drawer ${open ? "open" : ""}`}
      >
        <div className="sidebar-header">
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section-title">Browse</div>

          <Link
            to="/"
            className="sidebar-link"
            style={isActive("/") ? { background: "#27272a" } : null}
            onClick={onClose}
          >
            🏠 Home
          </Link>

          <Link
            to="/models"
            className="sidebar-link"
            style={isActive("/models") ? { background: "#27272a" } : null}
            onClick={onClose}
          >
            👩‍💻 Models
          </Link>

          <div className="sidebar-section-title">Links</div>

          <a
            href="https://github.com/caznovDev"
            className="sidebar-link"
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            💻 GitHub
          </a>
        </div>
      </aside>
    </>
  );
}

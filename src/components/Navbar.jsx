import React from "react";

export default function Navbar({ onMenuToggle }) {
  return (
    <header className="navbar">
      <button
        className="navbar-hamburger"
        onClick={onMenuToggle}
      >
        ☰
      </button>

      <div className="navbar-logo">
        <span className="navbar-logo-dot" />
        <span>PlayTube</span>
      </div>

      <div className="navbar-search">
        <input
          className="navbar-search-input"
          placeholder="Search"
        />
      </div>
    </header>
  );
}

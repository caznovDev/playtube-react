import React from "react";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-dot" />
        <span>PlayTube</span>
      </div>

      <div className="navbar-search">
        <input
          className="navbar-search-input"
          placeholder="Pesquisar (não funcional ainda)"
        />
      </div>
    </header>
  );
}

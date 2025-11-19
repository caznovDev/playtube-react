import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const linkBase =
    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-100 hover:bg-neutral-800";

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 transform border-r border-neutral-800 bg-neutral-900 transition-transform duration-200 md:static md:z-0 md:translate-x-0 md:flex md:flex-col ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-3 py-3 md:hidden">
          <span className="text-sm font-semibold text-gray-300">Menu</span>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="mt-2 space-y-1 px-2 py-2 text-sm">
          <div className="px-2 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">
            Navegar
          </div>

          <Link
            to="/"
            onClick={onClose}
            className={`${linkBase} ${
              isActive("/") ? "bg-neutral-800" : ""
            }`}
          >
            <span>🏠</span>
            <span>Início</span>
          </Link>

          <Link
            to="/models"
            onClick={onClose}
            className={`${linkBase} ${
              isActive("/models") ? "bg-neutral-800" : ""
            }`}
          >
            <span>👩‍💻</span>
            <span>Modelos</span>
          </Link>

          <div className="pt-2">
            <div className="px-2 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">
              Outros
            </div>
            <a
              href="https://github.com/caznovDev"
              target="_blank"
              rel="noreferrer"
              className={linkBase}
            >
              <span>💻</span>
              <span>GitHub</span>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}

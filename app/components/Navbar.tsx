"use client";

import { Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm flex items-center justify-between px-6 shrink-0 transition-all duration-300">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          LogiTrack – Sistema de Gestão Logística
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

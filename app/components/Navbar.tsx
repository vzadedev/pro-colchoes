"use client";

import { Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/50 dark:border-zinc-700/50 shadow-sm flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
          Visão Geral
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors relative"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors relative"
          aria-label="Notificações"
        >
          <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
          <Bell className="w-5 h-5" />
        </button>

        {/* User Avatar Placeholder */}
        <div className="ml-2 pl-4 border-l border-slate-200 dark:border-zinc-700">
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-medium text-sm shadow-md shadow-indigo-500/20">
              V
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

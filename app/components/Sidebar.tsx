"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Car,
  Package,
  FileText,
  ClipboardCheck,
  BarChart3,
  Star,
  MapPin,
} from "lucide-react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transportadores", label: "Transportadores", icon: Truck },
  { href: "/veiculos", label: "Veículos", icon: Car },
  { href: "/cargas", label: "Cargas", icon: Package },
  { href: "/notas-fiscais", label: "Notas Fiscais", icon: FileText },
  { href: "/entregas", label: "Entregas", icon: ClipboardCheck },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/rastreamento", label: "Rastreamento", icon: MapPin },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-screen bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-r border-slate-200/60 dark:border-zinc-800/60 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all z-50">
      <div className="h-20 flex items-center px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
            LogiTrack
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <div className="mb-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu Principal
        </div>
        <ul className="space-y-1.5">
          {menuItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                    ? "text-indigo-700 dark:text-indigo-300 font-medium"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50"
                    }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 opacity-100 transition-opacity"></div>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-r-full"></div>
                  )}
                  <Icon
                    className={`w-5 h-5 mr-3 shrink-0 relative z-10 transition-colors duration-300 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      }`}
                  />
                  <span className="relative z-10 text-sm">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 m-4 mt-auto bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-zinc-800/50 dark:to-indigo-500/10 rounded-2xl border border-slate-100/50 dark:border-zinc-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-500/30">
            <span className="text-indigo-700 dark:text-indigo-300 font-bold text-sm">PM</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pró Colchões</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Logística MS</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

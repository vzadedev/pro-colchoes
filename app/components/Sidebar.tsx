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
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-lg font-bold text-gray-800">
          LogiTrack
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                      ? "bg-blue-50/80 text-blue-700 font-medium shadow-sm"
                      : "text-gray-600 hover:bg-zinc-100/70 hover:text-gray-900"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 shrink-0 transition-colors duration-200 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      }`}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Sistema de Gestão Logística
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Protótipo acadêmico</p>
      </div>
    </aside>
  );
}

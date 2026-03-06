import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogiTrack – Sistema de Gestão Logística",
  description: "Protótipo de gestão logística – Pró Colchões MS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans text-slate-900 dark:text-slate-50 selection:bg-indigo-100 selection:text-indigo-900`}>
        {/* Fundo decorativo sutil (opcional para dar um toque premium) */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-black"></div>

        <div className="flex h-screen overflow-hidden">
          {/* Sidebar Fixa na Esquerda */}
          <Sidebar />

          {/* Área de Conteúdo Principal */}
          <div className="flex flex-col flex-1 overflow-hidden relative">
            {/* Navbar no Topo */}
            <div className="absolute top-0 w-full z-40 pointer-events-none px-6 pt-4">
              <div className="pointer-events-auto">
                <Navbar />
              </div>
            </div>

            {/* Onde as páginas são renderizadas */}
            <main className="flex-1 overflow-y-auto px-6 pb-6 pt-24 bg-transparent">
              <div className="max-w-7xl mx-auto w-full h-full">
                {children}
              </div>
            </main>
          </div>
          <Toaster position="top-right" richColors theme="system" />
        </div>
      </body>
    </html>
  );
}
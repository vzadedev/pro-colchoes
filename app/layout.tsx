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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
          {/* Sidebar Fixa na Esquerda */}
          <Sidebar />

          {/* Área de Conteúdo Principal */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Navbar no Topo */}
            <Navbar />

            {/* Onde as páginas são renderizadas */}
            <main className="flex-1 overflow-y-auto p-6 bg-zinc-50 dark:bg-zinc-900">
              {children}
            </main>
          </div>
          <Toaster position="top-right" richColors theme="light" />
        </div>
      </body>
    </html>
  );
}
"use client";

import { motion } from "framer-motion";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Card para indicadores e blocos de conteúdo
 */
export default function Card({ title, children, className = "", delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden relative group ${className}`}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800/50">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
      )}
      <div className="p-6 relative z-10">{children}</div>
    </motion.div>
  );
}

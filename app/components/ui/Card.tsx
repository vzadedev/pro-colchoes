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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-5 py-3 border-b border-gray-50/50 bg-gray-50/50">
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

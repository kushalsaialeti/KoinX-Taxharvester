"use client";

import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center">
            <span className="text-2xl font-black tracking-tight text-[#2563EB]">
              KoinX
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 self-start mt-1 ml-0.5">
              ®
            </span>
          </div>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="text-xs sm:text-base font-bold text-slate-600 dark:text-slate-300">
            Tax Loss Harvesting
          </span>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}

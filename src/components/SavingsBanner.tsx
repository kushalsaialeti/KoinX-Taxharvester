"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SavingsBannerProps {
  savings: number;
  show: boolean;
}

export default function SavingsBanner({ savings, show }: SavingsBannerProps) {
  const formattedSavings = savings.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full my-6"
        >
          <div className="bg-gradient-to-r from-emerald-500/15 via-green-500/20 to-emerald-500/15 border border-emerald-500/30 dark:border-emerald-500/20 text-emerald-800 dark:text-green-300 rounded-2xl p-4 text-center font-bold text-sm sm:text-base shadow-sm shadow-emerald-500/5 flex items-center justify-center gap-2">
            <span className="text-lg">🎉</span>
            <span>You&apos;re going to save <span className="text-emerald-600 dark:text-green-300 font-extrabold text-base sm:text-lg">₹{formattedSavings}</span> in taxes!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

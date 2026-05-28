"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CapitalGains } from "@/types";
import { realisedGains, taxSavings } from "@/lib/calculations";

interface TaxSavingsMeterProps {
  preGains: CapitalGains;
  postGains: CapitalGains;
  selectedCount: number;
}

export default function TaxSavingsMeter({ preGains, postGains, selectedCount }: TaxSavingsMeterProps) {
  const preG = realisedGains(preGains);
  const savings = taxSavings(preGains, postGains);

  // Calculate percentage: savings as a percentage of initial gains (capped at 100)
  const savingsPercent = preG > 0 ? Math.min(100, (savings / preG) * 100) : 0;

  // Framer Motion spring values for the needle angle
  const percentMotion = useMotionValue(0);
  const springValue = useSpring(percentMotion, { stiffness: 80, damping: 20 });
  
  // Transform the spring percent (0 to 100) to degrees (-90 to 90)
  const needleRotation = useTransform(springValue, (val) => (val / 100) * 180 - 90);

  useEffect(() => {
    percentMotion.set(savingsPercent);
  }, [savingsPercent, percentMotion]);

  // Determine stroke color class and code
  let strokeColor = "#EF4444"; // red
  if (savingsPercent > 70) {
    strokeColor = "#22C55E"; // green
  } else if (savingsPercent > 30) {
    strokeColor = "#F59E0B"; // amber
  }

  const formattedSavings = savings.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl w-full max-w-[280px] mx-auto min-h-[340px] transition-colors duration-300"
    >
      <div className="text-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Savings Progress
        </h3>
      </div>

      <div className="relative w-full flex items-center justify-center h-32 mt-4 select-none">
        {/* Semicircular gauge SVG */}
        <svg viewBox="0 0 200 120" className="w-full max-w-[190px]">
          {/* Background Arc */}
          <path
            d="M 20,100 A 80,80 0 0,1 180,100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="12"
            strokeLinecap="round"
            className="stroke-slate-100 dark:stroke-slate-800 transition-colors duration-300"
          />

          {/* Foreground Arc */}
          <motion.path
            d="M 20,100 A 80,80 0 0,1 180,100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251.327"
            // The dash offset controls how much of the arc is filled
            strokeDashoffset={251.327 - (savingsPercent / 100) * 251.327}
            className="transition-all duration-500 ease-out"
          />

          {/* Needle Group */}
          <motion.g style={{ rotate: needleRotation, transformOrigin: "100px 100px" }}>
            <polygon
              points="97,100 100,25 103,100"
              className="fill-slate-850 dark:fill-slate-100 transition-colors duration-300"
            />
            {/* Center Pivot Pin */}
            <circle
              cx="100"
              cy="100"
              r="6"
              className="fill-slate-900 dark:fill-slate-50 stroke-white dark:stroke-slate-900 stroke-2"
            />
          </motion.g>
        </svg>

        {/* Center Labels */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            ₹{formattedSavings}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Tax Saved
          </span>
        </div>
      </div>

      <div className="text-center mt-2 flex flex-col items-center">
        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors duration-300">
          {savingsPercent.toFixed(1)}% harvested
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1.5">
          {selectedCount} {selectedCount === 1 ? "holding" : "holdings"} selected
        </span>
      </div>
    </motion.div>
  );
}

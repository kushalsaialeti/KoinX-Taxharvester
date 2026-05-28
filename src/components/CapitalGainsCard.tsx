"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CapitalGains } from "@/types";
import { netGain, realisedGains } from "@/lib/calculations";

interface CapitalGainsCardProps {
  title: string;
  gains: CapitalGains;
  variant: "pre" | "post";
  savings?: number;
}

// Format numbers using Indian format (₹X,XX,XXX.XX)
function formatCurrency(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formatted = absAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Small numbers (< 0.01) formatting up to 8 decimal places if non-zero
  if (absAmount > 0 && absAmount < 0.01) {
    formatted = absAmount.toFixed(8).replace(/\.?0+$/, "");
  }

  if (amount === 0) {
    return "₹0.00";
  }

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}

function AnimatedValue({ value, className }: { value: string; className?: string }) {
  return (
    <div className="inline-block overflow-hidden relative vertical-align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`block ${className}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function CapitalGainsCard({ title, gains, variant, savings }: CapitalGainsCardProps) {
  const isPre = variant === "pre";
  const stcgNet = netGain(gains.stcg);
  const ltcgNet = netGain(gains.ltcg);
  const totalRealised = realisedGains(gains);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: isPre ? 0.1 : 0.3 }}
      className={`rounded-2xl p-6 shadow-xl w-full flex flex-col justify-between min-h-[340px] transition-all duration-300 ${
        isPre
          ? "bg-[#1E293B] dark:bg-[#0F172A] text-white border border-slate-700/35"
          : "bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] text-white border border-blue-500/25 shadow-blue-500/10"
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold tracking-wide uppercase opacity-90">{title}</h3>
          {!isPre && savings && savings > 0 ? (
            <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
              Tax Saved
            </span>
          ) : null}
        </div>

        {/* Desktop grid layout matching Figma */}
        <div className="grid grid-cols-3 gap-y-4 text-sm mt-2 border-b border-white/10 pb-6">
          {/* Row headers */}
          <div className="font-semibold opacity-70">Metric</div>
          <div className="text-right font-semibold opacity-70">Short-term</div>
          <div className="text-right font-semibold opacity-70">Long-term</div>

          {/* Profits */}
          <div className="opacity-80">Profits</div>
          <div className="text-right font-medium">
            <AnimatedValue value={formatCurrency(gains.stcg.profits)} />
          </div>
          <div className="text-right font-medium">
            <AnimatedValue value={formatCurrency(gains.ltcg.profits)} />
          </div>

          {/* Losses */}
          <div className="opacity-80">Losses</div>
          <div className="text-right font-medium text-red-300">
            <AnimatedValue value={formatCurrency(-gains.stcg.losses)} />
          </div>
          <div className="text-right font-medium text-red-300">
            <AnimatedValue value={formatCurrency(-gains.ltcg.losses)} />
          </div>

          {/* Net Capital Gains */}
          <div className="font-semibold">Net Capital Gains</div>
          <div className={`text-right font-semibold ${stcgNet < 0 ? "text-red-300" : stcgNet > 0 ? "text-green-300" : ""}`}>
            <AnimatedValue value={formatCurrency(stcgNet)} />
          </div>
          <div className={`text-right font-semibold ${ltcgNet < 0 ? "text-red-300" : ltcgNet > 0 ? "text-green-300" : ""}`}>
            <AnimatedValue value={formatCurrency(ltcgNet)} />
          </div>
        </div>
      </div>

      {/* Footer totals */}
      <div className="mt-6 pt-2">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <span className="text-sm font-semibold opacity-85">
            {isPre ? "Realised Capital Gains" : "Effective Capital Gains"}
          </span>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
            <AnimatedValue value={formatCurrency(totalRealised)} />
          </span>
        </div>
        {!isPre && savings && savings > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/10 text-xs font-semibold text-green-200"
          >
            <span>🎉</span>
            <span>You are going to save up to {formatCurrency(savings)}</span>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

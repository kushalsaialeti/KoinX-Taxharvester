"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { Holding } from "@/types";

interface HoldingsTableProps {
  holdings: Holding[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}

function formatQuantity(val: number): string {
  if (val === 0) return "0";
  if (Math.abs(val) < 1e-6) {
    return val.toExponential(4);
  }
  // format to 6 sig figs and strip trailing zeros
  return Number(val.toPrecision(6)).toString();
}

function formatCurrency(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (amount === 0) {
    return "₹0.00";
  }

  let formatted = absAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (absAmount > 0 && absAmount < 0.01) {
    formatted = absAmount.toFixed(8).replace(/\.?0+$/, "");
  }

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}

function CustomCheckbox({
  checked,
  indeterminate,
}: {
  checked: boolean;
  indeterminate?: boolean;
}) {
  return (
    <div
      className={`w-4.5 h-4.5 flex items-center justify-center rounded border transition-all duration-200 ${
        checked || indeterminate
          ? "bg-[#2563EB] border-[#2563EB] text-white"
          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-[#2563EB]"
      }`}
    >
      {checked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
      {indeterminate && <Minus className="w-3.5 h-3.5 stroke-[3.5]" />}
    </div>
  );
}

function HoldingRow({
  holding,
  isSelected,
  onToggle,
}: {
  holding: Holding;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.tr
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      onClick={onToggle}
      className={`group cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 transition-colors duration-200 ${
        isSelected
          ? "bg-blue-50/70 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-950/30"
          : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
      }`}
    >
      {/* 1. Checkbox Column (sticky on mobile) */}
      <td className={`p-4 sticky left-0 z-10 transition-colors duration-200 ${
        isSelected ? "bg-blue-50/70 dark:bg-[#0c1630]" : "bg-white dark:bg-[#0b0f19]"
      }`}>
        <CustomCheckbox checked={isSelected} />
      </td>

      {/* 2. Asset Column (sticky on mobile, right next to checkbox) */}
      <td className={`p-4 sticky left-[48px] z-10 transition-colors duration-200 ${
        isSelected ? "bg-blue-50/70 dark:bg-[#0c1630]" : "bg-white dark:bg-[#0b0f19]"
      }`}>
        <div className="flex items-center gap-3">
          {imgError || !holding.logo ? (
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm">
              {holding.coin.slice(0, 2)}
            </div>
          ) : (
            <Image
              src={holding.logo}
              alt={holding.coin}
              width={28}
              height={28}
              onError={() => setImgError(true)}
              className="w-7 h-7 rounded-full object-contain shrink-0 bg-slate-50 dark:bg-slate-800 p-0.5 shadow-sm"
            />
          )}
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
              {holding.coin}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[130px] sm:max-w-none">
              {holding.coinName}
            </span>
          </div>
        </div>
      </td>

      {/* 3. Holdings / Avg Buy Price */}
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            {formatQuantity(holding.totalHolding)} {holding.coin}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            Avg: {formatCurrency(holding.averageBuyPrice)}
          </span>
        </div>
      </td>

      {/* 4. Current Price */}
      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 text-sm">
        {formatCurrency(holding.currentPrice)}
      </td>

      {/* 5. Short-Term Gain */}
      <td className="p-4">
        <div className="flex flex-col">
          <span
            className={`font-semibold text-sm flex items-center gap-1 ${
              holding.stcg.gain > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : holding.stcg.gain < 0
                ? "text-red-500 dark:text-red-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {holding.stcg.gain !== 0 && (
              holding.stcg.gain > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
              )
            )}
            {formatCurrency(holding.stcg.gain)}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            Bal: {formatQuantity(holding.stcg.balance)}
          </span>
        </div>
      </td>

      {/* 6. Long-Term Gain */}
      <td className="p-4">
        <div className="flex flex-col">
          <span
            className={`font-semibold text-sm flex items-center gap-1 ${
              holding.ltcg.gain > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : holding.ltcg.gain < 0
                ? "text-red-500 dark:text-red-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {holding.ltcg.gain !== 0 && (
              holding.ltcg.gain > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
              )
            )}
            {formatCurrency(holding.ltcg.gain)}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            Bal: {formatQuantity(holding.ltcg.balance)}
          </span>
        </div>
      </td>

      {/* 7. Amount to Sell */}
      <td className="p-4 text-right">
        <span
          className={`text-sm font-bold ${
            isSelected
              ? "text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {isSelected ? `${formatQuantity(holding.totalHolding)} ${holding.coin}` : "—"}
        </span>
      </td>
    </motion.tr>
  );
}

export default function HoldingsTable({
  holdings,
  selectedIds,
  onToggle,
  onToggleAll,
}: HoldingsTableProps) {
  // Sort by impact descending: absolute value of (stcg.gain + ltcg.gain) descending
  const sortedHoldings = [...holdings].sort((a, b) => {
    const impactA = Math.abs(a.stcg.gain + a.ltcg.gain);
    const impactB = Math.abs(b.stcg.gain + b.ltcg.gain);
    return impactB - impactA;
  });

  const allSelected = holdings.length > 0 && selectedIds.size === holdings.length;
  const partiallySelected =
    selectedIds.size > 0 && selectedIds.size < holdings.length;

  return (
    <div className="w-full bg-white dark:bg-[#0b0f19] border border-slate-200/80 dark:border-slate-800/85 rounded-2xl shadow-xl overflow-hidden mt-6 transition-colors duration-300">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
          Holdings Available to Harvest
        </h3>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
          Sorted by tax impact
        </span>
      </div>

      <div className="overflow-x-auto relative w-full scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090c15] text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {/* Sticky Checkbox header */}
              <th className="p-4 sticky left-0 z-10 bg-slate-50 dark:bg-[#090c15] w-[48px]">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAll();
                  }}
                  className="cursor-pointer inline-block"
                >
                  <CustomCheckbox
                    checked={allSelected}
                    indeterminate={partiallySelected}
                  />
                </div>
              </th>
              {/* Sticky Asset header */}
              <th className="p-4 sticky left-[48px] z-10 bg-slate-50 dark:bg-[#090c15]">
                Asset
              </th>
              <th className="p-4">Holdings / Avg Buy Price</th>
              <th className="p-4">Current Price</th>
              <th className="p-4">Short-Term Gain</th>
              <th className="p-4">Long-Term Gain</th>
              <th className="p-4 text-right">Amount to Sell</th>
            </tr>
          </thead>
          
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
          >
            {sortedHoldings.map((h, index) => {
              const id = `${h.coin}-${h.coinName}`;
              return (
                <HoldingRow
                  key={id}
                  holding={h}
                  isSelected={selectedIds.has(id)}
                  onToggle={() => onToggle(id)}
                  index={index}
                />
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import CapitalGainsCard from "@/components/CapitalGainsCard";
import TaxSavingsMeter from "@/components/TaxSavingsMeter";
import SavingsBanner from "@/components/SavingsBanner";
import HoldingsTable from "@/components/HoldingsTable";
import { useHoldingsData } from "@/hooks/useHoldingsData";
import { applyHarvesting, taxSavings } from "@/lib/calculations";

export default function Home() {
  const { holdings, capitalGains, loading, error, refetch } = useHoldingsData();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(true);

  // Toggle selection for a specific holding
  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle selection for all holdings
  const handleToggleAll = () => {
    if (selectedIds.size === holdings.length) {
      setSelectedIds(new Set());
    } else {
      const next = new Set<string>();
      holdings.forEach((h) => {
        next.add(`${h.coin}-${h.coinName}`);
      });
      setSelectedIds(next);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col transition-colors duration-300">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow flex flex-col gap-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          </div>
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="h-[340px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-[340px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-[340px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-4" />
        </main>
      </div>
    );
  }

  if (error || !capitalGains) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col transition-colors duration-300">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Error Loading Dashboard</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error || "Data is unavailable"}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate pre/post harvesting states
  const selectedHoldings = holdings.filter((h) =>
    selectedIds.has(`${h.coin}-${h.coinName}`)
  );
  const postGains = applyHarvesting(capitalGains, selectedHoldings);
  const savings = taxSavings(capitalGains, postGains);
  const showSavings = savings > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow flex flex-col">
        {/* Title and Intro */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Tax Harvesting
              <a
                href="https://www.koinx.com/blog/tax-loss-harvesting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 font-sans pt-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                How it works?
              </a>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed max-w-2xl">
              Offset your realized crypto capital gains with capital losses to reduce your overall tax liability. Select assets below to harvest.
            </p>
          </div>
        </div>

        {/* Collapsible Disclaimer Box matching Figma details */}
        <div className="border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 rounded-2xl overflow-hidden mb-6 transition-colors duration-300">
          <button
            onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-blue-700 dark:text-blue-400 hover:bg-blue-100/10 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4.5 h-4.5" />
              <span>Important Notes & Disclaimers</span>
            </div>
            {disclaimerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence initial={false}>
            {disclaimerExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 space-y-2 border-t border-blue-100 dark:border-blue-950/40 pt-3"
              >
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                  <li>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
                  <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
                  <li>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
                  <li>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</li>
                  <li>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dashboard Grid (cards + meter) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Pre-Harvesting Card */}
          <div className="lg:col-span-4 flex">
            <CapitalGainsCard
              title="Pre Harvesting"
              gains={capitalGains}
              variant="pre"
            />
          </div>

          {/* Tax Savings Meter (Center column on desktop, between cards on mobile) */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <TaxSavingsMeter
              preGains={capitalGains}
              postGains={postGains}
              selectedCount={selectedIds.size}
            />
          </div>

          {/* After-Harvesting Card */}
          <div className="lg:col-span-4 flex">
            <CapitalGainsCard
              title="After Harvesting"
              gains={postGains}
              variant="post"
              savings={savings}
            />
          </div>
        </div>

        {/* Full-width Conditional Savings Banner */}
        <SavingsBanner savings={savings} show={showSavings} />

        {/* Holdings Table */}
        <div className="flex-grow">
          <HoldingsTable
            holdings={holdings}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
          />
        </div>
      </main>
    </div>
  );
}

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[110px] h-9 bg-slate-200 dark:bg-slate-800/50 rounded-full animate-pulse" />;
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-full shadow-inner transition-colors duration-300">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`relative flex items-center justify-center p-1.5 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md scale-100"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 scale-95"
            }`}
            title={`Set theme to ${opt.label}`}
          >
            <Icon className="w-4 h-4 transition-transform duration-300" />
            <span className="sr-only">{opt.label} theme</span>
          </button>
        );
      })}
    </div>
  );
}

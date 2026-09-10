"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setDark(false);
    } else {
      const isDark = document.documentElement.classList.contains("dark");
      setDark(isDark);
    }
  }, []);

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    setDark(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        aria-label="Loading theme"
      >
        <span className="h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
        <span className="hidden sm:inline">Theme</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
      aria-label="Toggle Dark and Light Theme"
      title="Click to toggle Light / Dark theme"
    >
      <span className="text-base leading-none">{dark ? "☀️" : "🌙"}</span>
      <span className="hidden sm:inline font-medium">
        {dark ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
}
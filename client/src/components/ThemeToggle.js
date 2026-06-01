"use client";

import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      aria-pressed={isDark}
      className="fixed top-6 right-6 z-40 rounded-full p-3 shadow-md transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        backgroundColor: colors.secondary,
        color: colors.accent,
        border: `2px solid ${colors.accent}`,
      }}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
    >
      <span className="sr-only">{isDark ? 'Mode terang' : 'Mode gelap'}</span>
      <span aria-hidden="true" className="text-lg leading-none">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}

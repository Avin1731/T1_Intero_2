"use client";

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function LoginNavbar() {
  const { colors } = useTheme();

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{
        borderColor: colors.accent,
        backgroundColor: colors.cardBg,
        color: colors.foreground,
      }}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-2xl px-2 py-1 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Kembali ke beranda Klinik Percobaan"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl shadow-inner transition group-hover:scale-105"
            style={{
              backgroundColor: colors.primary,
              color: '#fff',
            }}
            aria-hidden="true"
          >
            🩺
          </span>
          <span className="flex flex-col leading-tight">
            <span
              className="text-xs font-medium uppercase tracking-[0.25em]"
              style={{ color: colors.accent }}
            >
              Klinik
            </span>
            <span className="text-lg font-semibold" style={{ color: colors.primary }}>
              Percobaan
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}

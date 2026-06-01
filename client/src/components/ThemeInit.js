"use client";

import { useEffect } from 'react';
import { applyThemeToDocument, resolveIsDark } from '../lib/theme';

/**
 * Sinkronkan tema dari localStorage setelah hydrate.
 * Script di layout hanya untuk anti-flash; logika utama tetap di client.
 */
export default function ThemeInit() {
  useEffect(() => {
    applyThemeToDocument(resolveIsDark());
  }, []);

  return null;
}

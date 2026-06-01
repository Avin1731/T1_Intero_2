"use client";

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  applyThemeToDocument,
  getThemeColors,
  persistTheme,
  resolveIsDark,
} from '../lib/theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialDark = resolveIsDark();
    setIsDark(initialDark);
    applyThemeToDocument(initialDark);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyThemeToDocument(isDark);
  }, [isDark, ready]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      persistTheme(next);
      return next;
    });
  }, []);

  const colors = getThemeColors(isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

"use client";

import { ThemeProvider } from '../context/ThemeContext';
import ThemeInit from './ThemeInit';
import ThemeToggle from './ThemeToggle';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <ThemeInit />
      <ThemeToggle />
      {children}
    </ThemeProvider>
  );
}

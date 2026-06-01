"use client";

import { useTheme } from '../context/ThemeContext';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const { isDark } = useTheme();

  const getStyles = () => {
    const lightStyles = {
      primary: { backgroundColor: '#3A8A72', color: 'white' },
      secondary: { backgroundColor: '#F2EADA', color: '#22332F', border: '2px solid #F0B6A4' },
      ghost: { backgroundColor: 'transparent', color: '#3A8A72' },
    };

    const darkStyles = {
      primary: { backgroundColor: '#5db89f', color: '#1a1f1d' },
      secondary: { backgroundColor: '#2a3a36', color: '#e8e6e0', border: '2px solid #d4966a' },
      ghost: { backgroundColor: 'transparent', color: '#5db89f' },
    };

    const styles = isDark ? darkStyles : lightStyles;
    return styles[variant] ?? styles.primary;
  };

  return (
    <button
      style={getStyles()}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

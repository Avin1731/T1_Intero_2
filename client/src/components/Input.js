"use client";

import { useTheme } from '../context/ThemeContext';

export default function Input({ label, error, className = '', ...props }) {
  const { isDark } = useTheme();

  const lightStyles = {
    labelColor: '#22332F',
    borderColor: '#F0B6A4',
    backgroundColor: '#F2EADA',
    color: '#22332F',
    focusBorderColor: '#3A8A72',
  };

  const darkStyles = {
    labelColor: '#e8e6e0',
    borderColor: '#d4966a',
    backgroundColor: '#2a3a36',
    color: '#e8e6e0',
    focusBorderColor: '#5db89f',
  };

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <label className={`block text-sm font-medium ${className}`} style={{ color: styles.labelColor }}>
      {label}
      <input
        className="mt-2 w-full rounded-3xl px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2"
        style={{
          borderColor: styles.borderColor,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderWidth: '2px',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = styles.focusBorderColor;
          e.target.style.boxShadow = `0 0 0 2px ${styles.focusBorderColor}30`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = styles.borderColor;
          e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }}
        {...props}
      />
      {error ? <p className="mt-2 text-sm" style={{ color: '#dc2626' }}>{error}</p> : null}
    </label>
  );
}

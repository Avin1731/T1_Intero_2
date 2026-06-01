"use client";

import { useTheme } from '../context/ThemeContext';

export default function Popup({ type = 'success', title, message, onClose }) {
  const { isDark } = useTheme();

  const getStyles = () => {
    if (type === 'success') {
      return isDark
        ? {
            container: {
              backgroundColor: '#2a3a36',
              borderColor: '#5db89f',
              color: '#e8e6e0',
            },
            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.55)' },
            closeBtn: { color: '#d4966a' },
          }
        : {
            container: {
              backgroundColor: '#F2EADA',
              borderColor: '#F0B6A4',
              color: '#22332F',
            },
            overlay: { backgroundColor: 'rgba(34, 51, 47, 0.4)' },
            closeBtn: { color: '#22332F' },
          };
    }

    return isDark
      ? {
          container: {
            backgroundColor: '#3d2525',
            borderColor: '#f87171',
            color: '#fecaca',
          },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
          closeBtn: { color: '#fecaca' },
        }
      : {
          container: {
            backgroundColor: '#fee2e2',
            borderColor: '#fca5a5',
            color: '#7f1d1d',
          },
          overlay: { backgroundColor: 'rgba(127, 29, 29, 0.4)' },
          closeBtn: { color: '#7f1d1d' },
        };
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-sm" style={styles.overlay} />
      <div
        className="relative w-full max-w-md rounded-[28px] border p-6 shadow-2xl ring-1 transition-all duration-300 ease-out"
        style={{ ...styles.container, borderWidth: '2px', borderStyle: 'solid' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">
              {type === 'success' ? 'Berhasil' : 'Gagal'}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-semibold transition-colors hover:opacity-80"
            style={styles.closeBtn}
          >
            Tutup
          </button>
        </div>
        <p className="mt-4 text-sm leading-6">{message}</p>
      </div>
    </div>
  );
}

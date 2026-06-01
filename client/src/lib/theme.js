/** Teal Warmth palette — light & dark (COLOR_PALETTES.md #11) */
export const LIGHT_COLORS = {
  background: '#F6F4EE',
  foreground: '#22332F',
  primary: '#3A8A72',
  secondary: '#F2EADA',
  accent: '#F0B6A4',
  cardBg: 'rgba(242, 234, 218, 0.5)',
};

export const DARK_COLORS = {
  background: '#1a1f1d',
  foreground: '#e8e6e0',
  primary: '#5db89f',
  secondary: '#2a3a36',
  accent: '#d4966a',
  cardBg: 'rgba(42, 58, 54, 0.7)',
};

export function getThemeColors(isDark) {
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}

export const THEME_STORAGE_KEY = 'theme';

export function readStoredTheme() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return null;
}

/** Pertama kali = light; kunjungan berikutnya mengikuti pilihan tersimpan */
export function resolveIsDark() {
  return readStoredTheme() === 'dark';
}

export function persistTheme(isDark) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
}

export function applyThemeToDocument(isDark) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
}

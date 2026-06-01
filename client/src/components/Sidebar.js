"use client";

import Button from './Button';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Registrasi', path: '/dashboard' },
  { label: 'Booking', path: '/dashboard' },
];

export default function Sidebar({ userName = 'admin', onLogout }) {
  const { colors, isDark } = useTheme();

  return (
    <aside
      className="flex h-full w-72 flex-col justify-between border-r p-6 backdrop-blur-xl"
      style={{
        borderColor: colors.accent,
        backgroundColor: isDark ? 'rgba(42, 58, 54, 0.95)' : 'rgba(242, 234, 218, 0.95)',
        color: colors.foreground,
        borderWidth: '2px',
      }}
    >
      <div>
        <div className="mb-10 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-3xl text-white shadow-md font-semibold"
            style={{ backgroundColor: colors.primary }}
          >
            K
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em]" style={{ color: colors.accent }}>Klinik</p>
            <p className="text-xl font-semibold" style={{ color: colors.primary }}>Percobaan</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="block rounded-3xl px-4 py-3 text-sm font-medium transition hover:opacity-80"
              style={{
                color: colors.foreground,
                backgroundColor: isDark ? 'rgba(93, 184, 159, 0.15)' : 'rgba(58, 138, 114, 0.15)',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        <div
          className="rounded-3xl p-4"
          style={{
            backgroundColor: isDark ? 'rgba(93, 184, 159, 0.1)' : 'rgba(58, 138, 114, 0.1)',
            borderLeft: `3px solid ${colors.primary}`,
          }}
        >
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: colors.accent }}>Role</p>
          <p className="mt-1 text-lg font-semibold" style={{ color: colors.primary }}>Admin</p>
          <p className="text-sm" style={{ color: colors.accent }}>{userName}</p>
        </div>
        <Button variant="secondary" className="w-full" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
}

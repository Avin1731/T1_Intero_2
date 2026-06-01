"use client";

import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardPage() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: colors.background, color: colors.foreground }}
    >
      <Sidebar onLogout={() => router.push('/login')} />

      <main className="flex-1 p-10">
        <div
          className="rounded-[32px] border p-8 shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.accent,
            borderWidth: '2px',
          }}
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className="text-sm uppercase tracking-[0.3em]"
                style={{ color: colors.accent }}
              >
                Dashboard Admin
              </p>
              <h1 className="mt-3 text-4xl font-semibold" style={{ color: colors.primary }}>
                Halo, Admin Klinik Percobaan
              </h1>
            </div>
            <Button variant="secondary" onClick={() => router.push('/login')}>
              Logout
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div
              className="rounded-[28px] p-6 shadow-lg"
              style={{
                backgroundColor: `${colors.primary}20`,
                borderLeft: `4px solid ${colors.primary}`,
              }}
            >
              <p
                className="text-sm"
                style={{ color: colors.accent }}
              >
                Status Sistem
              </p>
              <p
                className="mt-3 text-2xl font-semibold"
                style={{ color: colors.primary }}
              >
                Aktif
              </p>
            </div>
            <div
              className="rounded-[28px] p-6 shadow-lg"
              style={{
                backgroundColor: `${colors.primary}20`,
                borderLeft: `4px solid ${colors.primary}`,
              }}
            >
              <p
                className="text-sm"
                style={{ color: colors.accent }}
              >
                Pengguna Terkini
              </p>
              <p
                className="mt-3 text-2xl font-semibold"
                style={{ color: colors.primary }}
              >
                Admin
              </p>
            </div>
          </div>

          <section
            className="mt-10 rounded-[28px] p-6 shadow-lg"
            style={{
              backgroundColor: `${colors.primary}20`,
              borderLeft: `4px solid ${colors.primary}`,
            }}
          >
            <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
              Ringkasan Klinik
            </h2>
            <p
              className="mt-3 leading-7"
              style={{ color: colors.foreground }}
            >
              Halaman dashboard ini adalah template awal untuk menampung fitur-fitur interoperabilitas.
              Nanti kita tambahkan daftar pasien, jadwal konsultasi, dan pengelolaan encounter.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
